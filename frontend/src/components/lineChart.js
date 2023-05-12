import React, { Component } from 'react';
import { Line, Bar } from 'react-chartjs-2';
import { Chart } from 'chart.js/auto';
import axios from 'axios';
// import {config} from "../../Constants";
// import AuthContext from "../context/AuthContext";
import { Container, Form } from "semantic-ui-react";
import { FlexboxGrid, SelectPicker, DateRangePicker } from 'rsuite';
Chart.register({ id: 'category', type: 'category', ticks: { align: 'center' } });

const selectOption = [
    { label: "Day", value: "byDay" },
    { label: "Weekdays", value: "byWeekday" },
    { label: "Weekends", value: "byWeekend" }
]

// const dataByDay = {
//     labels: ['1', '2', '3', '4', '5', '6', '7','1', '2', '3', '4', '5', '6', '7'],
//     datasets: [
//         {
//             label: 'Number of visitors by the hour (by day)',
//             data: [20, 10, 30, 15, 25, 20, 30,20, 10, 30, 15, 25, 20, 30],
//             fill: true,
//             borderColor: 'green',
//             backgroundColor:"rgb(75, 192, 192)",
//             tension: 0.5,
//         },
//         {
//             label: 'Number of visitors by the hour (by day)',
//             data: [20, 10, 30, 15, 25, 20, 30,20, 10, 30, 15, 25, 20, 30],
//             fill: true,
//             borderColor: 'green',
//             backgroundColor:"rgb(75, 0, 192)",
//             tension: 0.5,
//         }
//     ],
// };

// const dataByWeekday = {
//     labels: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
//     datasets: [
//         {
//             label: 'Number of visitors by the hour (by weekday)',
//             data: [40, 30, 20, 25, 35],
//             fill: false,
//             borderColor: 'rgb(75, 192, 192)',
//             tension: 0.1,
//         },
//     ],
// };

// const dataByWeekend = {
//     labels: ['Saturday', 'Sunday'],
//     datasets: [
//         {
//             label: 'Number of visitors by the hour (by weekend)',
//             data: [45, 50],
//             fill: false,
//             borderColor: 'rgb(75, 192, 192)',
//             tension: 0.1,
//         },
//     ],
// };

const dataByDay = { labels: [], datasets: [] };


class LineChart extends Component {
    // static contextType = AuthContext
    constructor(props) {
        super(props);
        this.state = {
            // dataByDay:dataByDay,
            // dataByWeekday:dataByWeekday,
            // dataByWeekend:dataByWeekend,
            selectedOption: 'byDay',
            chartData: dataByDay,
            gymList: props.gymList,
            locationId: props.locationId,
            dateRange:['1900-12-12','2100-12-12'],
            options: {
                scales: {
                    yAxes: [
                        {
                            ticks: {
                                beginAtZero: true,
                            },
                        },
                    ],
                    xAxes: [
                        {
                            type: 'category',
                            labels: [],
                        },
                    ],
                },
            },
        };
    }

    componentDidMount() {
        // const Auth = this.context
        // const user = Auth.getUser()
        // console.log(this.state.gymId);
        // console.log("here");
        // console.log(this.state.gymList);
        axios.post('/get_checkins', { 
            location_id: this.state.locationId, 
            start_time: this.state.dateRange[0], 
            end_time: this.state.dateRange[1] 
        })
            .then(response => {
                console.log(response.data)
                this.setState({
                    chartData: {
                        labels: response.data.dataByDay.labels, // update the labels here
                        datasets: response.data.dataByDay.datasets
                    },
                    dataByDay: {

                        labels: response.data.dataByDay.labels, // update the labels here
                        datasets: response.data.dataByDay.datasets
                    },
                    dataByWeekday: {
                        labels: response.data.dataByWeekday.labels,
                        datasets: response.data.dataByWeekday.datasets
                    },
                    dataByWeekend: {
                        labels: response.data.dataByWeekend.labels,
                        datasets: response.data.dataByWeekend.datasets
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                            xAxes: [{
                                type: 'category',
                                labels: response.data.dataByDay.labels,
                            }]
                        }
                    }
                });
            })
            .catch(error => console.log(error));
    }

    handleGymChange = (value) =>{
        console.log("here");
        console.log(value);
        this.state.locationId= value;
        console.log(this.state.locationId);
        this.componentDidMount();
    }

    handleDateChange = (value) =>{
        console.log("here2");
        console.log(value);
        this.state.dateRange= value;
        console.log(this.state.dateRange);
        this.componentDidMount();
    }

    handleOptionChange = (event) => {
        const value = event.target.value;
        this.setState({ selectedOption: value });
        switch (value) {
            case 'byWeekday':
                this.setState({
                    chartData: {
                        labels: this.state.dataByWeekday.labels,
                        datasets: this.state.dataByWeekday.datasets
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                            xAxes: [{
                                type: 'category',
                                labels: this.state.dataByWeekday.labels,
                            }]
                        }
                    }

                });
                // console.log("aaaout")
                break;

            case 'byWeekend':
                console.log(this.state.dataByWeekend.datasets)
                this.setState({
                    chartData: {
                        labels: this.state.dataByWeekend.labels,
                        datasets: this.state.dataByWeekend.datasets
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                            xAxes: [{
                                type: 'category',
                                labels: this.state.dataByWeekend.labels,
                            }]
                        }
                    }

                });
                break;
            default:
                this.setState({
                    chartData: {
                        labels: this.state.dataByDay.labels,
                        datasets: this.state.dataByDay.datasets
                    },
                    options: {
                        scales: {
                            yAxes: [
                                {
                                    ticks: {
                                        beginAtZero: true,
                                    },
                                },
                            ],
                            xAxes: [{
                                type: 'category',
                                labels: this.state.dataByDay.labels,
                            }]
                        }
                    }

                });
                break;
        }
    };

    render() {
        return (<>

            <Container style={{ width: "620px" , margin:"20px"}}>
                <Form>
                    <div>
                        <FlexboxGrid justify='space-around'>
                            <FlexboxGrid.Item>
                                <div>
                                    <label>By : </label>
                                    <select
                                        value={this.state.selectedOption}
                                        onChange={this.handleOptionChange}
                                    >
                                        <option value="byDay">Day</option>
                                        <option value="byWeekday">Weekday</option>
                                        <option value="byWeekend">Weekend</option>
                                    </select>
                                    
                                </div>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                <select
                                        className="form-select me-2 form-select-sm"
                                        aria-label="Default select example"
                                        value={this.state.locationId}
                                        onChange={(e) => {
                                            this.handleGymChange(e.target.value);
                                        }}
                                    >
                                        <option key="default" value="">Select location</option>
                                        {this.state.gymList && this.state.gymList.map((loc) => {
                                            return (
                                                <option key={loc.value} value={loc.value}>{loc.label}</option>
                                            );
                                        })}
                                    </select>
                            </FlexboxGrid.Item>
                            <FlexboxGrid.Item>
                                <div>
                                    <label>Date Range : </label>
                                    <DateRangePicker placeholder="Select Date Range"  onChange={this.handleDateChange}/>
                                </div>
                            </FlexboxGrid.Item>
                        </FlexboxGrid>

                        {this.state.chartData.datasets && this.state.chartData.datasets.length > 0 ? (
                            <Bar data={this.state.chartData} options={this.state.options} />
                        ) : (
                            <p>No data to display. Change dates to see.</p>
                        )}
                        <br />
                    </div>
                </Form>
            </Container>
        </>
        );
    }
}

export default LineChart;