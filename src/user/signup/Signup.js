import React, { Component } from 'react';
import { signup, checkcpfAvailability, checkEmailAvailability, subscribeCliente, subscribeEmail } from '../../util/APIUtils';
import './Signup.css';
import { 
    NAME_MIN_LENGTH, NAME_MAX_LENGTH, 
    USERNAME_MIN_LENGTH, USERNAME_MAX_LENGTH,
    EMAIL_MAX_LENGTH,
    PASSWORD_MIN_LENGTH, PASSWORD_MAX_LENGTH
} from '../../constants';

import { Form, Input, Button, notification, Select } from 'antd';

import { format as formatCPF } from "gerador-validador-cpf";
import { validate as validateCPF } from "gerador-validador-cpf";

const FormItem = Form.Item;

const { Option } = Select;

class Signup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            login: {
                value: ''
            },
            senha: {
                value: ''
            },
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
            uf: {
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
            },
            telefone: {
                tipo: {
                    value: ''
                },
                numero: {
                    value: ''
                }
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
        const inputName = target.name;        
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
            login: this.state.login.value,
            senha: this.state.senha.value,
            nome: this.state.nome.value
        };

        signup(signupRequest)
        .then(response => {
            this.handleSubscribeCliente();
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

    handleSubscribeEmail(email) {
        subscribeEmail(email)
        .then(response => {
            notification.success({
                message: 'Prova React',
                description: "Email salvo com sucesso!",
            });
        }).catch(error => {
           notification.error({
                message: 'Prova React',
                description: error.message || 'Desculpe!! Alguma coisa deu erro, tent novamente!'
            }); 
        });

    }

    handleSubscribeCliente() {
        const cliente = {
                nome: this.state.nome.value,
                cpf: formatCPF(this.state.cpf.value, "digits"),
                cep: this.state.cep.value,
                logradouro: this.state.logradouro.value,
                numero: this.state.numero.value,
                bairro: this.state.bairro.value,
                cidade: this.state.cidade.value,
                uf: this.state.uf.value,
                complemento: this.state.complemento.value
            }
        subscribeCliente(cliente)
        .then(response => {
            console.log(response)
            notification.success({
                message: 'Prova React',
                description: "Cliente salvo com sucesso!",
            });
            const email = {
                email: this.state.email.value,
                clienteId: response.id
            }
            this.handleSubscribeEmail(email);
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
                            <Input id="nome"
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
                            label="CEP"
                            validateStatus={this.state.cep.validateStatus}
                            help={this.state.cep.errorMsg}>
                            <Input 
                                size="large"
                                name="cep"
                                type="ZIP"
                                autoComplete="off"
                                placeholder="Informe seu CEP"
                                value={this.state.cep.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateEndereco)} />    
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
                                onChange={(event) => this.handleInputChange(event, this.validateEndereco)} />    
                        </FormItem>

                        <FormItem 
                            label="Numero"
                            validateStatus={this.state.numero.validateStatus}
                            help={this.state.numero.errorMsg}>
                            <Input 
                                size="large"
                                name="numero"
                                type="number"
                                autoComplete="off"
                                placeholder="Numero"
                                value={this.state.numero.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>

                        <FormItem 
                            label="UF"
                            validateStatus={this.state.uf.validateStatus}
                            help={this.state.uf.errorMsg}>
                            <Input 
                                size="large"
                                name="uf"
                                autoComplete="off"
                                placeholder="UF"
                                value={this.state.uf.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateEndereco)} />    
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
                                onChange={(event) => this.handleInputChange(event, this.validateEndereco)} />    
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
                                onChange={(event) => this.handleInputChange(event, this.validateEndereco)} />    
                        </FormItem>
                        

                        <FormItem 
                            label="Complemento"
                            validateStatus={this.state.complemento.validateStatus}
                            help={this.state.complemento.errorMsg}>
                            <Input 
                                size="large"
                                name="complemento"
                                autoComplete="off"
                                placeholder="Complemento"
                                value={this.state.complemento.value} 
                                onChange={(event) => this.handleInputChange(event, this.validateEndereco)} />    
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
                            label="Login"
                            hasFeedback
                            validateStatus={this.state.login.validateStatus}
                            help={this.state.email.errorMsg}>
                            <Input 
                                size="large"
                                name="login" 
                                type="text" 
                                autoComplete="off"
                                placeholder="Informe seu login"
                                value={this.state.login.value} 
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validateName)} />    
                        </FormItem>
                        <FormItem 
                            label="Senha"
                            hasFeedback
                            validateStatus={this.state.senha.validateStatus}
                            help={this.state.senha.errorMsg}>
                            <Input 
                                size="large"
                                name="senha" 
                                type="password" 
                                autoComplete="off"
                                placeholder="Informe sua senha"
                                value={this.state.senha.value} 
                                onBlur={this.validateEmailAvailability}
                                onChange={(event) => this.handleInputChange(event, this.validatePassword)} />    
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
                errorMsg: `Este campo esta pequeno (Mínimo ${NAME_MIN_LENGTH} caracteres.)`
            }
        } else if (name.length > NAME_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Este campos esta grande (Máximo ${NAME_MAX_LENGTH} caracteres.)`
            }
        } else {
            return {
                validateStatus: 'success',
                errorMsg: null,
              };            
        }
    }

    validateEndereco = (name) => {
        if(name.length < 2) {
            return {
                validateStatus: 'error',
                errorMsg: `Este campo esta pequeno (Mínimo 2 caracteres.)`
            }
        } else if (name.length > 20) {
            return {
                validationStatus: 'error',
                errorMsg: `Este campo esta grande (Máximo 20 caracteres.)`
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
                errorMsg: 'Email não pode estar vazio'                
            }
        }

        const EMAIL_REGEX = RegExp('[^@ ]+@[^@ ]+\\.[^@ ]+');
        if(!EMAIL_REGEX.test(email)) {
            return {
                validateStatus: 'error',
                errorMsg: 'Email inválido'
            }
        }

        if(email.length > EMAIL_MAX_LENGTH) {
            return {
                validateStatus: 'error',
                errorMsg: `Este campos esta grande (Máximo ${EMAIL_MAX_LENGTH} caracteres)`
            }
        }

        return {
            validateStatus: null,
            errorMsg: null
        }
    }

    validatecpf = (cpf) => {
        if(cpf.length < 11) {
            return {
                validateStatus: 'error',
                errorMsg: `CPF está muito pequeno  (Mínimo ${11} caracteres.)`
            }
        } else if (cpf.length > 11) {
            return {
                validationStatus: 'error',
                errorMsg: `CPF está muito grande (Máximo ${11} caracteres.)`
            }
        } else if (validateCPF(cpf)===false) {
            return {
                validationStatus: 'error',
                errorMsg: `CPF inválido.`
            }
        } else {
            console.log(formatCPF(cpf));
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
                value: formatCPF(cpf),
                validateStatus: 'validating',
                errorMsg: null
            }
        });

        checkcpfAvailability(cpf)
        .then(response => {
            if(response.available) {
                this.setState({
                    cpf: {
                        value: formatCPF(cpf),
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
                    value: formatCPF(cpf),
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
                errorMsg: `Senha está pequena (Mínimo ${PASSWORD_MIN_LENGTH} caracteres.)`
            }
        } else if (password.length > PASSWORD_MAX_LENGTH) {
            return {
                validationStatus: 'error',
                errorMsg: `Senha esta grande (Máximo ${PASSWORD_MAX_LENGTH} caracteres.)`
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