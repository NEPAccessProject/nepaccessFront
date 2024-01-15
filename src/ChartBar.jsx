import React from 'react';
import globals from './globals.jsx';
import { HorizontalBar } from 'react-chartjs-2';
// import { Line, Pie, Doughnut, Bar, Radar, Polar, Bubble, Scatter } from 'react-chartjs-2';

const chartClass = "chart-holder";

export default class ChartBar extends React.Component {
    constructor(props) {
        super(props);
        this.chart_ref = React.createRef();
    }

    render() {
        // console.log(this.props.data);
        if(this.props.stacked && this.props.meta && this.props.down){ 

            let _labels = this.props.meta.labelArray;
            let _down = this.props.down.valueArray;
            let _meta = this.props.meta.valueArray;

            // let _datasets = [];

            // _dataDraft.forEach((datum) => {
            //     _datasets.push(
            //         {
            //             label:this.props.label,
            //             data: datum,
            //             minBarLength: 5,
            //             backgroundColor: globals.colors,
            //             borderColor: globals.colors,
            //             borderWidth: 1
            //         }
            //     )
            // });

            const data = {
                labels: _labels,
                datasets: [
                    {
                        label: "Downloadable",
                        backgroundColor: "#E66100",
                        minBarLength: 5,
                        data: _down,
                    }, {
                        label: "Metadata",
                        backgroundColor: "#5D3A9B",
                        minBarLength: 5,
                        data: _meta
                    }
                ]
            };
            
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                },
                title: {
                    display: false,
                    text: this.props.label
                },
                scales: {
                    // offset: false,
                    yAxes: [{
                        gridLines: {
                            // lineWidth: 20
                        },
                        ticks: {
                            autoSkip : false,
                            // lineHeight: 20,
                            // fontSize: 20,
                        },
                        stacked: true
                        // barThickness: 10
                    }],
                    xAxes: [{ stacked: false }],
                },
                tooltips: {
                    backgroundColor: 'rgba(0, 0, 0, 1.0)'
                },
                "hover": {
                    "animationDuration": 0
                },
                // "animation": {
                //     "duration": 1,
                //     "onComplete": function() {
                //         var chartInstance = this.chart,
                //         ctx = chartInstance.ctx;
                //     //   ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                //     //   ctx.textAlign = 'center';
                //     //   ctx.textBaseline = 'bottom';
                        
                //         // show value to the right of the bar
                //         this.data.datasets.forEach(function(dataset, i) {
                //             var meta = chartInstance.controller.getDatasetMeta(i);
                //             meta.data.forEach(function(bar, index) {
                //                 var data = dataset.data[index];
                //                 ctx.fillText(data, bar._model.x + 15, bar._model.y + 1);
                //             });
                //         });
                //     }
                // },
                
            };
    
            return (
                <div hidden={this.props.option!==this.props.label} className={chartClass + " " + this.props.size + " bar-holder"}>
                    <h2 className="chart-label">{this.props.label}</h2>
                    <HorizontalBar ref={this.chart_ref} data={data} options={options} />
                </div>
            );
            
        }
        // Single label source "Grouped" bar with draft and final
        else if(this.props.data && this.props.data.labels){
            let _labels = this.props.data.labels;
            let _dataDraft = this.props.data.valueArrayDraft;
            let _dataFinal = this.props.data.valueArrayFinal;

            const data = {
                labels: _labels,
                datasets: [
                    {
                        label: "Draft",
                        backgroundColor: "#E66100",
                        minBarLength: 5,
                        data: _dataDraft,
                    }, {
                        label: "Final",
                        backgroundColor: "#5D3A9B",
                        minBarLength: 5,
                        data: _dataFinal
                    }
                ]
            };
            
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                },
                title: {
                    display: false,
                    text: this.props.label
                },
                scales: {
                    // offset: false,
                    yAxes: [{
                        gridLines: {
                            // lineWidth: 20
                        },
                        ticks: {
                            autoSkip : false,
                            // lineHeight: 20,
                            // fontSize: 20,
                        },
                        // barThickness: 10
                    }],
                },
                tooltips: {
                    backgroundColor: 'rgba(0, 0, 0, 1.0)'
                },
                "hover": {
                    "animationDuration": 0
                },
                "animation": {
                    "duration": 1,
                    "onComplete": function() {
                        var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    //   ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    //   ctx.textAlign = 'center';
                    //   ctx.textBaseline = 'bottom';
                        
                        // show value to the right of the bar
                        this.data.datasets.forEach(function(dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function(bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x + 15, bar._model.y + 1);
                            });
                        });
                    }
                },
            };
    
            return (
                <div hidden={this.props.option!==this.props.label} className={chartClass + " " + this.props.size + " bar-holder"}>
                    <h2 className="chart-label">{this.props.label}</h2>
                    <HorizontalBar ref={this.chart_ref} data={data} options={options} />
                </div>
            );

        }
        // "Grouped" bar with draft and final
        else if(this.props.data && this.props.data[0] && this.props.data[1]){ 

            let _labelsDraft = this.props.data[0].labelArrayDraft;
            // draft/final labels should be the same, and in the same order
            // let _labelsFinal = this.props.data[1].labelArrayFinal; 
            let _dataDraft = this.props.data[0].valueArrayDraft;
            let _dataFinal = this.props.data[1].valueArrayFinal;

            const data = {
                labels: _labelsDraft,
                datasets: [
                    {
                        label: "Draft",
                        backgroundColor: "#E66100",
                        minBarLength: 5,
                        data: _dataDraft,
                    }, {
                        label: "Final",
                        backgroundColor: "#5D3A9B",
                        minBarLength: 5,
                        data: _dataFinal
                    }
                ]
            };
            
            const options = {
                responsive: true,
                maintainAspectRatio: false,
                legend: {
                    display: true
                },
                title: {
                    display: false,
                    text: this.props.label
                },
                scales: {
                    // offset: false,
                    yAxes: [{
                        gridLines: {
                            // lineWidth: 20
                        },
                        ticks: {
                            autoSkip : false,
                            // lineHeight: 20,
                            // fontSize: 20,
                        },
                        // barThickness: 10
                    }],
                },
                tooltips: {
                    backgroundColor: 'rgba(0, 0, 0, 1.0)'
                },
                "hover": {
                    "animationDuration": 0
                },
                "animation": {
                    "duration": 1,
                    "onComplete": function() {
                        var chartInstance = this.chart,
                        ctx = chartInstance.ctx;
                    //   ctx.font = Chart.helpers.fontString(Chart.defaults.global.defaultFontSize, Chart.defaults.global.defaultFontStyle, Chart.defaults.global.defaultFontFamily);
                    //   ctx.textAlign = 'center';
                    //   ctx.textBaseline = 'bottom';
                        
                        // show value to the right of the bar
                        this.data.datasets.forEach(function(dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function(bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x + 15, bar._model.y + 1);
                            });
                        });
                    }
                },
            };
    
            return (
                <div hidden={this.props.option!==this.props.label} className={chartClass + " " + this.props.size + " bar-holder"}>
                    <h2 className="chart-label">{this.props.label}</h2>
                    <HorizontalBar ref={this.chart_ref} data={data} options={options} />
                </div>
            );

        }
        else if(this.props.data) {

            let _labels = this.props.data.labelArray;
            let _data = this.props.data.valueArray;
            if(this.props.data.labelArrayFinal) {
                _labels = this.props.data.labelArrayFinal;
                _data = this.props.data.valueArrayFinal;
            } else if(this.props.data.labelArrayDraft) {
                _labels = this.props.data.labelArrayDraft;
                _data = this.props.data.valueArrayDraft;
            }

            const data = {
                labels: _labels,
                datasets: [
                    {
                        label: this.props.label,
                        data: _data,
                        // backgroundColor: [
                        // "Red",
                        // "Blue",
                        // "Yellow",
                        // "Green",
                        // "Purple",
                        // "Orange"
                        // ],
                        minBarLength: 5,
                        backgroundColor: globals.colors,
                        // borderColor: globals.colors,
                        // borderWidth: 1
                    }
                ]
            };

            const options = {
                legend: {
                    display: false
                },
                tooltips: {
                    backgroundColor: 'rgba(0, 0, 0, 1.0)'
                },
                "hover": {
                    "animationDuration": 0
                },
                "animation": {
                    "duration": 1,
                    "onComplete": function() {
                        var chartInstance = this.chart,
                        ctx = chartInstance.ctx;

                    //   ctx.font =
                    //   ctx.textAlign = 'center';
                    //   ctx.textBaseline = 'bottom';

                        this.data.datasets.forEach(function(dataset, i) {
                            var meta = chartInstance.controller.getDatasetMeta(i);
                            meta.data.forEach(function(bar, index) {
                                var data = dataset.data[index];
                                ctx.fillText(data, bar._model.x + 15, bar._model.y + 5);
                            });
                        });
                    }
                },
            }
    
            return (
                <div hidden={this.props.option!==this.props.label} className={chartClass + " " + this.props.size + " bar-holder"}>
                    <h2 className="chart-label">{this.props.label}</h2>
                    <HorizontalBar ref={this.chart_ref} data={data} options={options} />
                </div>
            );
        }

        return <></>;
        
    }

    componentDidMount() {
        // if(this.chart_ref.chart){
        //     console.log("props",this.props.data);
        //     const { datasets } = this.chart_ref.chart.chartInstance.data
        //     console.log("Dataset 0",datasets[0].data);
        // }
    }
}
