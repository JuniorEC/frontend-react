import React, { Component } from 'react';
import { createClient } from '../util/APIUtils';
import { MAX_CHOICES, CLIENT_QUESTION_MAX_LENGTH, CLIENT_CHOICE_MAX_LENGTH } from '../constants';
import './NewClient.css';  
import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

class NewClient extends Component {
    constructor(props) {
        super(props);
        this.state = {
            question: {
                text: ''
            },
            choices: [{
                text: ''
            }, {
                text: ''
            }],
            clientLength: {
                days: 1,
                hours: 0
            },
            nome:'' ,
            genero:'',
            cpf:''
        };
        this.addChoice = this.addChoice.bind(this);
        this.removeChoice = this.removeChoice.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleQuestionChange = this.handleQuestionChange.bind(this);
        this.handleChoiceChange = this.handleChoiceChange.bind(this);
        this.handleClientDaysChange = this.handleClientDaysChange.bind(this);
        this.handleClientHoursChange = this.handleClientHoursChange.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    emitEmpty = () => {
        this.nomeInput.focus();
        this.setState({ nome: '' });
    }

    onChangeNome = (e) => {
        this.setState({ nome: e.target.value });
    }

    onChangeCpf = (e) => {
        this.setState({ cpf: e.target.value });
    }

    addChoice(event) {
        const choices = this.state.choices.slice();        
        this.setState({
            choices: choices.concat([{
                text: ''
            }])
        });
    }

    removeChoice(choiceNumber) {
        const choices = this.state.choices.slice();
        this.setState({
            choices: [...choices.slice(0, choiceNumber), ...choices.slice(choiceNumber+1)]
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        const clientData = {
            question: this.state.question.text,
            choices: this.state.choices.map(choice => {
                return {text: choice.text} 
            }),
            clientLength: this.state.clientLength
        };

        createClient(clientData)
        .then(response => {
            this.props.history.push("/");
        }).catch(error => {
            if(error.status === 401) {
                this.props.handleLogout('/login', 'error', 'You have been logged out. Please login create client.');    
            } else {
                notification.error({
                    message: 'Prova React',
                    description: error.message || 'Desculpe! alguma coisa aconteceu de errado. tente novamente!'
                });              
            }
        });
    }

    validateQuestion = (questionText) => {
        if(questionText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter your question!'
            }
        } else if (questionText.length > CLIENT_QUESTION_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Question is too long (Maximum ${CLIENT_QUESTION_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleQuestionChange(event) {
        const value = event.target.value;
        this.setState({
            question: {
                text: value,
                ...this.validateQuestion(value)
            }
        });
    }

    validateChoice = (choiceText) => {
        if(choiceText.length === 0) {
            return {
                validateStatus: 'error',
                errorMsg: 'Please enter a choice!'
            }
        } else if (choiceText.length > CLIENT_CHOICE_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Choice is too long (Maximum ${CLIENT_CHOICE_MAX_LENGTH} characters allowed)`
            }    
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null
            }
        }
    }

    handleChoiceChange(event, index) {
        const choices = this.state.choices.slice();
        const value = event.target.value;

        choices[index] = {
            text: value,
            ...this.validateChoice(value)
        }

        this.setState({
            choices: choices
        });
    }


    handleClientDaysChange(value) {
        const clientLength = Object.assign(this.state.clientLength, {days: value});
        this.setState({
            clientLength: clientLength
        });
    }

    handleClientHoursChange(value) {
        const clientLength = Object.assign(this.state.clientLength, {hours: value});
        this.setState({
            clientLength: clientLength
        });
    }

    isFormInvalid() {
        if(this.state.question.validateStatus !== 'success') {
            return true;
        }
    
        for(let i = 0; i < this.state.choices.length; i++) {
            const choice = this.state.choices[i];            
            if(choice.validateStatus !== 'success') {
                return true;
            }
        }
    }

    render() {
        const { nome } = this.state;
        const suffix = nome ? <Icon type="close-circle" onClick={this.emitEmpty} /> : null;
   
        const choiceViews = [];
        this.state.choices.forEach((choice, index) => {
            choiceViews.push(<ClientChoice key={index} choice={choice} choiceNumber={index} removeChoice={this.removeChoice} handleChoiceChange={this.handleChoiceChange}/>);
        });

        return (
            <div className="new-client-container">
                <h1 className="page-title">Cadastrar Cliente</h1>
                <div className="new-client-content">
                    <Form onSubmit={this.handleSubmit} className="create-client-form">

                        <FormItem className="client-form-row">
                        <Input
                                placeholder="Informe seu nome"
                                prefix={<Icon type="user" />}
                                suffix={suffix}
                                value={nome}
                                onChange={this.onChangeNome}
                                ref={node => this.nomeInput = node}
                            />
                        </FormItem>

                        <FormItem className="client-form-row">
                        <Input
                                placeholder="Informe seu CPF"
                                prefix={<Icon type="user" />}
                                suffix={suffix}
                                value={nome}
                                onChange={this.onChangeNome}
                                ref={node => this.nomeInput = node}
                            />
                        </FormItem>


                        {choiceViews}
                        <FormItem className="client-form-row">
                            <Button type="dashed" onClick={this.addChoice} disabled={this.state.choices.length === MAX_CHOICES}>
                                <Icon type="plus" /> Telefone
                            </Button>
                        </FormItem>

                        {choiceViews}
                        <FormItem className="client-form-row">
                            <Button type="dashed" onClick={this.addChoice} disabled={this.state.choices.length === MAX_CHOICES}>
                                <Icon type="plus" /> E-mail
                            </Button>
                        </FormItem>
                        <FormItem className="client-form-row">
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                disabled={this.isFormInvalid()}
                                className="create-client-form-button">Cadastrar</Button>
                        </FormItem>
                    </Form>
                </div>    
            </div>
        );
    }
}

function ClientChoice(props) {
    return (
        <FormItem validateStatus={props.choice.validateStatus}
        help={props.choice.errorMsg} className="client-form-row">
            <Input 
                placeholder = {'Choice ' + (props.choiceNumber + 1)}
                size="large"
                value={props.choice.text} 
                className={ props.choiceNumber > 1 ? "optional-choice": null}
                onChange={(event) => props.handleChoiceChange(event, props.choiceNumber)} />

            {
                props.choiceNumber > 1 ? (
                <Icon
                    className="dynamic-delete-button"
                    type="close"
                    disabled={props.choiceNumber <= 1}
                    onClick={() => props.removeChoice(props.choiceNumber)}
                /> ): null
            }    
        </FormItem>
    );
}


export default NewClient;