import React, {useEffect, useState} from 'react';
import '../CommonStylings/FullScreenDiv.css';
import axios from 'axios';
import { CSVLink, CSVDownload } from "react-csv";

class Admin extends React.Component {

    constructor(props){
        super(props);
        this.csvLink = React.createRef();
        this.state = { data: "Initialize value"}
    }

    fetchData = () => {
        axios.get('/download').then(res => {
            console.log(res);
            this.setState({ data: res.data}, () => {
                setTimeout(() => {
                    this.csvLink.current.link.click();
                }, 0);
            })
        }).catch(err => console.log(err));
    }

    render() {
        return (
            <div>
                <button onClick={this.fetchData}>Download CSV</button>
                {/*{ this.state.data ? <CSVLink data={this.state.data} ref={this.csvLink}>Download</CSVLink> : null }*/}
                <CSVLink
                    data={this.state.data}
                    filename="data.csv"
                    className="hidden"
                    ref={this.csvLink}
                    target="_blank"
                />
            </div>
        )
    }
}

export default (Admin);
