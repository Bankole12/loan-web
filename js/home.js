/*--------------------------------------
	sidebar
--------------------------------------*/

"use strict";

// Set new default font family and font color to mimic Bootstrap's default styling
Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';

$(document).ready(function () {
  var modal = $(".modal");
  $(".full_container").hide();
  $('#sidebar').toggleClass('active');
  /*-- sidebar js --*/
  $('#sidebarCollapse').on('click', function () {
    $('#sidebar').toggleClass('active');
  });

  modal.modal("show");
  $.ajax({
    type: "POST",
    url: "https://localhost:6005/user/dash",
    data: {},
    success: (resp) => {
      const data = resp.data[0];
      // console.log(data);
      const {total_loans,total_users,daily, monthly, distribution} = data;
      

      $(".modal-backdrop").remove();
      modal.modal('hide');
      $(".full_container").show();

      $("#users").text(total_users);
      $("#total_loans").text(total_loans || 0);
      // $("#pending_loans").text(pending_loans || 0);
      // $("#approved_loans").text(approved_loans || 0);

      data.loan_state.forEach(state => {
        switch(state._id){
          case 'pending':  $("#pending_loans").text(state.total || 0);
          break;
          case 'approved': $("#approved_loans").text(state.total || 0);
          break;
          default:
            return null;
        }
      });
      drawLineGraph(daily);
      drawBarChart(monthly);
      drawPieChart(distribution);
    },
    error: (err) => {
      console.log("Loading error: ", err);
    }
  });

  
});

/*--------------------------------------
    scrollbar js
--------------------------------------*/

var ps = new PerfectScrollbar('#sidebar');

function number_format(number, decimals, dec_point, thousands_sep) {
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  number = (number + '').replace(',', '').replace(' ', '');
  var n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

function drawLineGraph(values){
  var lineLabel = [];
  var lineData = [];

  for(var i = 0; i<7; i++){
    var data = values[i];
    if(data!= null){
      lineLabel.push(data._id.day);
      lineData.push(data.count);
    }
  }
  // console.log(chartLabel,chartData);
  var ctx = $("#myAreaChart");
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: lineLabel,
      datasets: [{
        label: "Earnings",
        lineTension: 0.3,
        backgroundColor: "rgba(78, 115, 223, 0.05)",
        borderColor: "rgba(78, 115, 223, 1)",
        pointRadius: 3,
        pointBackgroundColor: "rgba(78, 115, 223, 1)",
        pointBorderColor: "rgba(78, 115, 223, 1)",
        pointHoverRadius: 3,
        pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
        pointHoverBorderColor: "rgba(78, 115, 223, 1)",
        pointHitRadius: 10,
        pointBorderWidth: 2,
        data: lineData,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'date'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 7
          }
        }],
        yAxes: [{
          ticks: {
            maxTicksLimit: 7,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
              return number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        intersect: false,
        mode: 'index',
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ': GH ' + number_format(tooltipItem.yLabel);
          }
        }
      }
    }
  });
}

function drawBarChart(values){
  const barLabel = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul","Aug","Sep","Oct","Nov","Dec"];
  var barData = [0,0,0,0,0,0,0,0,0,0,0,0,0];
  for(var i=0; i<values.length; i++){
    var month = Number(values[i]._id.month); 
    barData.splice(month-1,0,values[i].count);  
  }
  var maxLabel =  Math.max.apply(null,barData); 
//  console.log(barLabel,barData);
  var ctx = $("#myBarChart");
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: barLabel,
      datasets: [{
        label: "Loans",
        backgroundColor: ['#36b9cc',"#9ab9cc",'#4e73df', '#1cc88a','#9e73df','#7e9cdf','#888888','#9e33d9','#2223a1','#a95a53','#abfbfb','#aeaeae'],
        hoverBackgroundColor: ['#36b9cc',"#9ab9cc",'#4e73df', '#1cc88a','#9e73df','#7e9cdf','#888888','#9e33d9','#2223a1','#a95a53','#abfbfb','#aeaeae'],
        borderColor: ['#36b9cc',"#9ab9cc",'#4e73df', '#1cc88a','#9e73df','#7e9cdf','#888888','#9e33d9','#2223a1','#a95a53','#abfbfb','#aeaeae'],
        data: barData,
      }],
    },
    options: {
      maintainAspectRatio: false,
      layout: {
        padding: {
          left: 10,
          right: 25,
          top: 25,
          bottom: 0
        }
      },
      scales: {
        xAxes: [{
          time: {
            unit: 'month'
          },
          gridLines: {
            display: false,
            drawBorder: false
          },
          ticks: {
            maxTicksLimit: 12
          },
          maxBarThickness: 25,
        }],
        yAxes: [{
          ticks: {
            min: 0,
            max: maxLabel,
            maxTicksLimit: 5,
            padding: 10,
            // Include a dollar sign in the ticks
            callback: function(value, index, values) {
              return number_format(value);
            }
          },
          gridLines: {
            color: "rgb(234, 236, 244)",
            zeroLineColor: "rgb(234, 236, 244)",
            drawBorder: false,
            borderDash: [2],
            zeroLineBorderDash: [2]
          }
        }],
      },
      legend: {
        display: false
      },
      tooltips: {
        titleMarginBottom: 10,
        titleFontColor: '#6e707e',
        titleFontSize: 14,
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
        callbacks: {
          label: function(tooltipItem, chart) {
            var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
            return datasetLabel + ':' + number_format(tooltipItem.yLabel);
          }
        }
      },
    }
  });
}

function drawPieChart(values){
  var chartVal = [values[1].count, values[0].count];

  var ctx = $("#myPieChart");
  new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: ["Male","Female"],
      datasets: [{
        data: chartVal,
        backgroundColor: ['#4e73df', '#1cc88a'],
        hoverBackgroundColor: ['#2e59d9', '#17a673'],
        hoverBorderColor: "rgba(234, 236, 244, 1)",
      }],
    },
    options: {
      maintainAspectRatio: false,
      tooltips: {
        backgroundColor: "rgb(255,255,255)",
        bodyFontColor: "#858796",
        borderColor: '#dddfeb',
        borderWidth: 1,
        xPadding: 15,
        yPadding: 15,
        displayColors: false,
        caretPadding: 10,
      },
      legend: {
        display: true,
        position: 'bottom'
      },
      cutoutPercentage: 80,
    },
  });
}
