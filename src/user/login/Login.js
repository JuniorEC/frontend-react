import React, { Component } from 'react';
import { login } from '../../util/APIUtils';
import './Login.css';
import { ACCESS_TOKEN } from '../../constants';

import { Form, Input, Button, Icon, notification } from 'antd';
const FormItem = Form.Item;

class Login extends Component {
    render() {
        const AntWrappedLoginForm = Form.create()(LoginForm)
        return (
            <div className="login-container">
                <h1 className="page-title">Autenticar Usuario</h1>
                <div className="login-content">
                    <AntWrappedLoginForm onLogin={this.props.onLogin} />
                </div>
            </div>
        );
    }
}

class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        event.preventDefault();   
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const loginRequest = Object.assign({}, values);
                login(loginRequest)
                .then(response => {
                    localStorage.setItem(ACCESS_TOKEN, response.accessToken);
                    this.props.onLogin();
                }).catch(error => {
                    if(error.status === 401) {
                        notification.error({
                            message: 'Prova React',
                            description: 'Usuario/Senha invalido, por favor tente novamente!'
                        });                    
                    } else {
                        notification.error({
                            message: 'Prova React',
                            description: error.message || 'Desculpe! alguma coisa deu erro. Tente novamente!'
                        });                                            
                    }
                });
            }
        });
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <Form onSubmit={this.handleSubmit} className="login-form">
                <FormItem>
                    {getFieldDecorator('login', {
                        rules: [{ required: true, message: 'Por favor, informe seu usuario!' }],
                    })(
                    <Input 
                        prefix={<Icon type="user" />}
                        size="large"
                        name="login" 
                        placeholder="Usuario" />    
                    )}
                </FormItem>
                <FormItem>
                {getFieldDecorator('senha', {
                    rules: [{ required: true, message: 'Por favor, informa sua senha!' }],
                })(
                    <Input 
                        prefix={<Icon type="lock" />}
                        size="large"
                        name="senha" 
                        type="password" 
                        placeholder="Senha"  />                        
                )}
                </FormItem>
                <FormItem>
                    <Button type="primary" htmlType="submit" size="large" className="login-form-button">Enviar</Button>
                </FormItem>
            </Form>
        );
    }
}


export default Login;