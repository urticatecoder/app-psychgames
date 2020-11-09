import React, {useEffect, useState} from 'react';
import '../CommonStylings/FullScreenDiv.css';
import axios from 'axios';
import { CSVLink, CSVDownload } from "react-csv";

class Admin extends React.Component {

    constructor(props){
        super(props);
        this.gameOneDataLink = React.createRef();
        this.gameTwoDataLink = React.createRef();
        this.state = { data: "Initialize value"}
    }

    fetchGameOneData = () => {
        axios.get('/download-game1').then(res => {
            console.log(res);
            this.setState({ data: res.data}, () => {
                setTimeout(() => {
                    this.gameOneDataLink.current.link.click();
                }, 0);
            })
        }).catch(err => console.log(err));
    }

    fetchGameTwoData = () => {
        axios.get('/download-game2').then(res => {
            console.log(res);
            this.setState({ data: res.data}, () => {
                setTimeout(() => {
                    this.gameTwoDataLink.current.link.click();
                }, 0);
            })
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <button onClick={this.fetchGameOneData}>Download Game 1 Data</button>
                {/*{ this.state.data ? <CSVLink data={this.state.data} ref={this.csvLink}>Download</CSVLink> : null }*/}
                <CSVLink
                    data={this.state.data}
                    filename="data.csv"
                    className="hidden"
                    ref={this.gameOneDataLink}
                    target="_blank"
                />
                <button onClick={this.fetchGameTwoData}>Download Game 2 Data</button>
                <CSVLink
                    data={this.state.data}
                    filename="data.csv"
                    className="hidden"
                    ref={this.gameTwoDataLink}
                    target="_blank"
                />
            </div>
        )
    }
}

export default (Admin);
