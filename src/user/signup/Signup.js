import React, { Component } from 'react';
import { signup, checkcpfAvailability, checkEmailAvailability } from '../../util/APIUtils';
import './Signup.css';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import { Form, Input, Button, notification } from 'antd';
const FormItem = Form.Item;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nome: {
                value: ''
            },
            cpf: {
                value: ''
            },
            email: {
                value: ''
            },
            logradouro: {
                value: ''
            },
            cep: {
                value: ''
            },
            cidade: {
                value: ''
            },
            bairro: {
                value: ''
            },
            numero: {
                value: ''
            },
            complemento: {
                value: ''
            }
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.validatecpfAvailability = this.validatecpfAvailability.bind(this);
        this.validateEmailAvailability = this.validateEmailAvailability.bind(this);
        this.isFormInvalid = this.isFormInvalid.bind(this);
    }

    handleInputChange(event, validationFun) {
        const target = event.target;
        const inputName = target.nome;        
        const inputValue = target.value;

        this.setState({
            [inputName] : {
                value: inputValue,
                ...validationFun(inputValue)
            }
        });
    }

    handleSubmit(event) {
        event.preventDefault();
    
        const signupRequest = {
            nome: this.state.nome.value,
            email: this.state.email.value,
            cpf: this.state.cpf.value,
            cep: this.state.cep.value,
            logradouro: this.state.logradouro.value,
            numero: this.state.numero.value,
            bairro: this.state.bairro.value,
            cidade: this.state.cidade.value,
            complemento: this.state.complemento.value

        };
        signup(signupRequest)
        .then(response => {
            notification.success({
                message: 'Prova React',
                description: "Registro realizado com sucesso!",
            });          
            this.props.history.push("/login");
        }).catch(error => {
            notification.error({
                message: 'Prova React',
                description: error.message || 'Desculpe!! Alguma coisa deu erro, tent novamente!'
            });
        });
    }

    isFormInvalid() {
        return !(this.state.nome.validateStatus === 'success' &&
            this.state.cpf.validateStatus === 'success' &&
            this.state.email.validateStatus === 'success' &&
            this.state.logradouro.validateStatus === 'success'
        );
    }

    render() {
        return (
            <div className="signup-container">
                <h1 className="page-title">Registro Cliente</h1>
                <div className="signup-content">
                    <Form onSubmit={this.handleSubmit} className="signup-form">
                        <FormItem 
                            label="Nome completo"
                            validateStatus={this.state.nome.validateStatus}
                            help={this.state.nome.errorMsg}>
                            <Input 
                                size="large"
                                name="nome"
                                autoComplete="off"
                                placeholder="Informe seu nome"
                                value={this.state.nome.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem label="CPF"
                            hasFeedback
                            validateStatus={this.state.cpf.validateStatus}
                            help={this.state.cpf.errorMsg}>
                            <Input 
                                size="large"
                                name="cpf" 
                                autoComplete="off"
                                placeholder="Cadastro de pessoa fisica"
                                value={this.state.cpf.value} 
                                onBlur={this.validatecpfAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validatecpf)} />    
                        </FormItem>
                        <FormItem 
                            label="E-mail"
                            hasFeedback
                            validateStatus={this.state.email.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input 
                                size="large"
                                name="email" 
                                type="email" 
                                autoComplete="off"
                                placeholder="Informe seu email"
                                value={this.state.email.value} 
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateEmail)} />    
                        </FormItem>
                        <FormItem 
                            label="CEP"
                            validateStatus={this.state.cep.validateStatus}
                            help={this.state.cep.errorMsg}>
                            <Input 
                                size="large"
                                name="cep"
                                autoComplete="off"
                                placeholder="Cep da sua Rua"
                                value={this.state.cep.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem 
                            label="Logradouro"
                            validateStatus={this.state.logradouro.validateStatus}
                            help={this.state.logradouro.errorMsg}>
                            <Input 
                                size="large"
                                name="logradouro"
                                autoComplete="off"
                                placeholder="Informe seu endereço"
                                value={this.state.logradouro.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>

                        <FormItem 
                            label="Numero"
                            validateStatus={this.state.numero.validateStatus}
                            help={this.state.numero.errorMsg}>
                            <Input 
                                size="large"
                                name="numero"
                                autoComplete="off"
                                placeholder="Numero"
                                value={this.state.numero.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>

                        <FormItem 
                            label="Cidade"
                            validateStatus={this.state.cidade.validateStatus}
                            help={this.state.cidade.errorMsg}>
                            <Input 
                                size="large"
                                name="cidade"
                                autoComplete="off"
                                placeholder="Cidade"
                                value={this.state.cidade.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>

                        <FormItem 
                            label="Bairro"
                            validateStatus={this.state.bairro.validateStatus}
                            help={this.state.bairro.errorMsg}>
                            <Input 
                                size="large"
                                name="bairro"
                                autoComplete="off"
                                placeholder="Bairro"
                                value={this.state.bairro.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        

                        <FormItem 
                            label="Complento"
                            validateStatus={this.state.complemento.validateStatus}
                            help={this.state.complemento.errorMsg}>
                            <Input 
                                size="large"
                                name="complemento"
                                autoComplete="off"
                                placeholder="Complemento"
                                value={this.state.complemento.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem>
                            <Button type="primary" 
                                htmlType="submit" 
                                size="large" 
                                className="signup-form-button"
                                disabled={this.isFormInvalid()}>Cadastrar</Button>
                            
                        </FormItem>
                    </Form>
                </div>
            </div>
        );
    }

    // Validation Functions

    validateName = (name) => {
        if(name.length < NAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Name is too short (Minimum ${NAME_MIN_LENGTH} characters needed.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Name is too long (Maximum ${NAME_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };            
        }
    }

    validateEmail = (email) => {
        if(!email) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email may not be empty'                
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email not valid'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Email is too long (Maximum ${EMAIL_MAX_LENGTH} characters allowed)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validatecpf = (cpf) => {
        if(cpf.length < USERNAME_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `CPF está muito pequeno  (Minimo ${USERNAME_MIN_LENGTH} caracter necessario.)`
            }
        } else if (cpf.length > USERNAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `CPF está muito grande (Maximo ${USERNAME_MAX_LENGTH} caracter permitido.)`
            }
        } else {
            return {
                validateStatus: null,
                errorMsg: null
            }
        }
    }

    validatecpfAvailability() {
        
        const cpf = this.state.cpf.value;
        const cpfValidation = this.validatecpf(cpf);

        if(cpfValidation.validateStatus === 'error') {
            this.setState({
                cpf: {
                    value: cpf,
                    ...cpfValidation
                }
            });
            return;
        }

        this.setState({
            cpf: {
                value: cpf,
                validateStatus: 'Validando',
                errorMsg: null
            }
        });

        checkcpfAvailability(cpf)
        .then(response => {
            if(response.available) {
                this.setState({
                    cpf: {
                        value: cpf,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    cpf: {
                        value: cpf,
                        validateStatus: 'error',
                        errorMsg: 'CPF já existe'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                cpf: {
                    value: cpf,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validateEmailAvailability() {
        // First check for client side errors in email
        const emailValue = this.state.email.value;
        const emailValidation = this.validateEmail(emailValue);

        if(emailValidation.validateStatus === 'error') {
            this.setState({
                email: {
                    value: emailValue,
                    ...emailValidation
                }
            });    
            return;
        }

        this.setState({
            email: {
                value: emailValue,
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkEmailAvailability(emailValue)
        .then(response => {
            if(response.available) {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'success',
                        errorMsg: null
                    }
                });
            } else {
                this.setState({
                    email: {
                        value: emailValue,
                        validateStatus: 'error',
                        errorMsg: 'This Email is already registered'
                    }
                });
            }
        }).catch(error => {
            // Marking validateStatus as success, Form will be recchecked at server
            this.setState({
                email: {
                    value: emailValue,
                    validateStatus: 'success',
                    errorMsg: null
                }
            });
        });
    }

    validatePassword = (password) => {
        if(password.length < PASSWORD_MIN_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Password is too short (Minimum ${PASSWORD_MIN_LENGTH} characters needed.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Password is too long (Maximum ${PASSWORD_MAX_LENGTH} characters allowed.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
            };            
        }
    }

}

export default Signup;