import React, { Component } from 'react';
import { getAllClients, getUserCreatedClients, getUserVotedClients } from '../util/APIUtils';
import Client from './Client';
import { castVote } from '../util/APIUtils';
import LoadingIndicator  from '../common/LoadingIndicator';
import { Button, Icon, notification } from 'antd';
import { CLIENT_LIST_SIZE } from '../constants';
import { withRouter } from 'react-router-dom';
import './ClientList.css';

class ClientList extends Component {
    constructor(props) {
        super(props);
        this.state = {
            clients: [],
            page: 0,
            size: 10,
            totalElements: 0,
            totalPages: 0,
            last: true,
            currentVotes: [],
            isLoading: false
        };
        this.loadClientList = this.loadClientList.bind(this);
        this.handleLoadMore = this.handleLoadMore.bind(this);
    }

    loadClientList(page = 0, size = CLIENT_LIST_SIZE) {
        let promise;
        if(this.props.username) {
            if(this.props.type === 'USER_CREATED_CLIENTS') {
                promise = getUserCreatedClients(this.props.username, page, size);
            } else if (this.props.type === 'USER_VOTED_CLIENTS') {
                promise = getUserVotedClients(this.props.username, page, size);                               
            }
        } else {
            promise = getAllClients(page, size);
        }

        if(!promise) {
            return;
        }

        this.setState({
            isLoading: true
        });

        promise            
        .then(response => {
            const clients = this.state.clients.slice();
            const currentVotes = this.state.currentVotes.slice();

            this.setState({
                clients: clients.concat(response.content),
                page: response.page,
                size: response.size,
                totalElements: response.totalElements,
                totalPages: response.totalPages,
                last: response.last,
                currentVotes: currentVotes.concat(Array(response.content.length).fill(null)),
                isLoading: false
            })
        }).catch(error => {
            this.setState({
                isLoading: false
            })
        });  
        
    }

    componentDidMount() {
        this.loadClientList();
    }

    componentDidUpdate(nextProps) {
        if(this.props.isAuthenticated !== nextProps.isAuthenticated) {
            // Reset State
            this.setState({
                clients: [],
                page: 0,
                size: 10,
                totalElements: 0,
                totalPages: 0,
                last: true,
                currentVotes: [],
                isLoading: false
            });    
            this.loadClientList();
        }
    }

    handleLoadMore() {
        this.loadClientList(this.state.page + 1);
    }

    handleVoteChange(event, clientIndex) {
        const currentVotes = this.state.currentVotes.slice();
        currentVotes[clientIndex] = event.target.value;

        this.setState({
            currentVotes: currentVotes
        });
    }


    handleVoteSubmit(event, clientIndex) {
        event.preventDefault();
        if(!this.props.isAuthenticated) {
            this.props.history.push("/login");
            notification.info({
                message: 'Prova React',
                description: "Informe seu login.",          
            });
            return;
        }

        const client = this.state.clients[clientIndex];
        const selectedChoice = this.state.currentVotes[clientIndex];

        const voteData = {
            clientID: client.id,
            choiceId: selectedChoice
        };

        castVote(voteData)
        .then(response => {
            const clients = this.state.clients.slice();
            clients[clientIndex] = response;
            this.setState({
                clients: clients
            });        
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login to vote');    
            } else {
                notification.error({
                    message: 'Prova React',
                    description: error.message || 'Desculpe! alguma coisa aconteceu de errado. tente novamente!'
                });                
            }
        });
    }

    render() {
        const clientViews = [];
        this.state.clients.forEach((client, clientIndex) => {
            clientViews.push(<Client 
                key={client.id} 
                client={client}
                currentVote={this.state.currentVotes[clientIndex]} 
                handleVoteChange={(event) => this.handleVoteChange(event, clientIndex)}
                handleVoteSubmit={(event) => this.handleVoteSubmit(event, clientIndex)} />)            
        });

        return (
            <div className="clients-container">
                {clientViews}
                {
                    !this.state.isLoading && this.state.clients.length === 0 ? (
                        <div className="no-clients-found">
                            <span>Nenhum cliente econtrado.</span>
                        </div>    
                    ): null
                }  
                {
                    !this.state.isLoading && !this.state.last ? (
                        <div className="load-more-clients"> 
                            <Button type="dashed" onClick={this.handleLoadMore} disabled={this.state.isLoading}>
                                <Icon type="plus" /> Load more
                            </Button>
                        </div>): null
                }              
                {
                    this.state.isLoading ? 
                    <LoadingIndicator />: null                     
                }
            </div>
        );
    }
}

export default withRouter(ClientList);