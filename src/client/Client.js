import React, { Component } from 'react';
import './Client.css';
import { Avatar, Icon } from 'antd';
import { Link } from 'react-router-dom';
import { getAvatarColor } from '../util/Colors';
import { formatDateTime } from '../util/Helpers';

import { Radio, Button } from 'antd';
const RadioGroup = Radio.Group;

class Client extends Component {
    calculatePercentage = (choice) => {
        if(this.props.client.totalVotes === 0) {
            return 0;
        }
        return (choice.voteCount*100)/(this.props.client.totalVotes);
    };

    isSelected = (choice) => {
        return this.props.client.selectedChoice === choice.id;
    }

    getWinningChoice = () => {
        return this.props.client.choices.reduce((prevChoice, currentChoice) => 
            currentChoice.voteCount > prevChoice.voteCount ? currentChoice : prevChoice, 
            {voteCount: -Infinity}
        );
    }

    getTimeRemaining = (client) => {
        const expirationTime = new Date(client.expirationDateTime).getTime();
        const currentTime = new Date().getTime();
    
        var difference_ms = expirationTime - currentTime;
        var seconds = Math.floor( (difference_ms/1000) % 60 );
        var minutes = Math.floor( (difference_ms/1000/60) % 60 );
        var hours = Math.floor( (difference_ms/(1000*60*60)) % 24 );
        var days = Math.floor( difference_ms/(1000*60*60*24) );
    
        let timeRemaining;
    
        if(days > 0) {
            timeRemaining = days + " days left";
        } else if (hours > 0) {
            timeRemaining = hours + " hours left";
        } else if (minutes > 0) {
            timeRemaining = minutes + " minutes left";
        } else if(seconds > 0) {
            timeRemaining = seconds + " seconds left";
        } else {
            timeRemaining = "less than a second left";
        }
        
        return timeRemaining;
    }

    render() {
        const clientChoices = [];
        if(this.props.client.selectedChoice || this.props.client.expired) {
            const winningChoice = this.props.client.expired ? this.getWinningChoice() : null;

            this.props.client.choices.forEach(choice => {
                clientChoices.push(<CompletedOrVotedClientChoice 
                    key={choice.id} 
                    choice={choice}
                    isWinner={winningChoice && choice.id === winningChoice.id}
                    isSelected={this.isSelected(choice)}
                    percentVote={this.calculatePercentage(choice)} 
                />);
            });                
        } else {
            this.props.client.choices.forEach(choice => {
                clientChoices.push(<Radio className="client-choice-radio" key={choice.id} value={choice.id}>{choice.text}</Radio>)
            })    
        }        
        return (
            <div className="client-content">
                <div className="client-header">
                    <div className="client-creator-info">
                        <Link className="creator-link" to={`/users/${this.props.client.createdBy.username}`}>
                            <Avatar className="client-creator-avatar" 
                                style={{ backgroundColor: getAvatarColor(this.props.client.createdBy.name)}} >
                                {this.props.client.createdBy.name[0].toUpperCase()}
                            </Avatar>
                            <span className="client-creator-name">
                                {this.props.client.createdBy.name}
                            </span>
                            <span className="client-creator-username">
                                @{this.props.client.createdBy.username}
                            </span>
                            <span className="client-creation-date">
                                {formatDateTime(this.props.client.creationDateTime)}
                            </span>
                        </Link>
                    </div>
                    <div className="client-question">
                        {this.props.client.question}
                    </div>
                </div>
                <div className="client-choices">
                    <RadioGroup 
                        className="client-choice-radio-group" 
                        onChange={this.props.handleVoteChange} 
                        value={this.props.currentVote}>
                        { clientChoices }
                    </RadioGroup>
                </div>
                <div className="client-footer">
                    { 
                        !(this.props.client.selectedChoice || this.props.client.expired) ?
                        (<Button className="vote-button" disabled={!this.props.currentVote} onClick={this.props.handleVoteSubmit}>Vote</Button>) : null 
                    }
                    <span className="total-votes">{this.props.client.totalVotes} votes</span>
                    <span className="separator">•</span>
                    <span className="time-left">
                        {
                            this.props.client.expired ? "Final results" :
                            this.getTimeRemaining(this.props.client)
                        }
                    </span>
                </div>
            </div>
        );
    }
}

function CompletedOrVotedClientChoice(props) {
    return (
        <div className="cv-client-choice">
            <span className="cv-client-choice-details">
                <span className="cv-choice-percentage">
                    {Math.round(props.percentVote * 100) / 100}%
                </span>            
                <span className="cv-choice-text">
                    {props.choice.text}
                </span>
                {
                    props.isSelected ? (
                    <Icon
                        className="selected-choice-icon"
                        type="check-circle-o"
                    /> ): null
                }    
            </span>
            <span className={props.isWinner ? 'cv-choice-percent-chart winner': 'cv-choice-percent-chart'} 
                style={{width: props.percentVote + '%' }}>
            </span>
        </div>
    );
}


export default Client;