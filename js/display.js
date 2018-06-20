/* Here we create a named Port. This named port will be used to communicate with the background script.
 * Once the page is loaded, we will send the joke and that means that background.js knows that we are now alive , and they will reply
 * with the reddit username
 *
 */
 
var port = chrome.runtime.connect({name: "knockknock"});
port.postMessage({joke: "Knock knock"});
/* Here we wait for the reply which includes the user that is going to be displayed. 
 */
port.onMessage.addListener(function(r) {
	
	console.log("[display] ->",r.sorted.com);
	console.log("[display] -> r", r);
	var myChart = echarts.init(document.getElementById('main'));
	draw2_results(myChart,r.sorted.com);
	var myChart2 =  echarts.init(document.getElementById('test'));
	draw2_results(myChart2,r.sorted.pos);
	
	var sum1 = r.sorted.com.reduce((accumulator, currentValue) => accumulator + Number(currentValue.total),0);
	console.log("total posts analyzed:",sum1);
	console.log("user posted in subreddits:",r.sorted.com.length);
	
	var sum2 = r.sorted.pos.reduce((accumulator, currentValue) => accumulator + Number(currentValue.total),0);
	console.log("total posts analyzed:",sum2);
	console.log("user posted in subreddits:",r.sorted.pos.length);

	$("#comments").html("<strong>" + r.sorted.user + "</strong> has " + sum1  + " posts in " + r.sorted.com.length + " subreddits");
	$("#posts").html("<strong>" + r.sorted.user + "</strong> has " + sum2  + " comments in " + r.sorted.pos.length + " subreddits");
	});


function draw2_results(myChart,sorted_conter){
		
var dataAxis = new Array();
var data = new Array();

for(var j in sorted_conter) {
	
    var nam  = sorted_conter[j]["name"];
	var num =  sorted_conter[j]["total"];
	dataAxis.push(nam);
	data.push(num);
}

option = {
    color: ['#3398DB'],
    tooltip : {
        trigger: 'axis',
        axisPointer : {            
            type : 'shadow'        
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
			
            type : 'category',
            data : dataAxis,
			labelAngle: -60,
			axisLabel :{
				rotate:60,
			},
            axisTick: {
                alignWithLabel: true
            }
        }
    ],
	
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'Posts',
            type:'bar',
            barWidth: '60%',
            data:data
        }
    ]
};
myChart.setOption(option);	
}
