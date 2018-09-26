import React, { Component } from 'react';
import { Dimensions, View, TextInput, StyleSheet, Button, Text, AsyncStorage } from 'react-native';

const width = Dimensions.get('screen').width;

export default class Login extends Component {

    constructor() {
        super();
        this.state = {
            usuario: 'rafael',
            senha: '123456',
            mensagem: '',
        }
    }

    efetuaLogin = () => {
        const uri = "https://instalura-api.herokuapp.com/api/public/login";
        const requestInfo = {
            method: 'POST',
            body: JSON.stringify({
                login: this.state.usuario,
                senha: this.state.senha
            }),
            headers: new Headers({
                'Content-type': 'application/json'
            })
        };
        fetch(uri, requestInfo)
            .then(response => {
                if (response.ok)
                    return response.text();
                throw new Error('Não foi possível efetuar login');
            })
            .then(token => {
                AsyncStorage.setItem('token', token);
                AsyncStorage.setItem('usuario', this.state.usuario);
                // navegue para o feed
                this.props.navigator.resetTo({
                    screen: 'Feed',
                    title: 'Instalura',
                });
            })
            .catch(error => this.setState({ mensagem: e.message }));
    }

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.titulo}>Instalura</Text>
                <View style={styles.form}>
                    <TextInput style={styles.input}
                        autoCapitalize="none"
                        placeholder="Usuário..."
                        defaultValue="rafael"
                        onChangeText={texto => this.setState({ usuario: texto })} />
                    <TextInput style={styles.input}
                        autoCapitalize="none"
                        secureTextEntry={true}
                        placeholder="Senha..."
                        defaultValue="123456"
                        onChangeText={texto => this.setState({ senha: texto })} />
                    <Button title="Login"
                        onPress={this.efetuaLogin}/>
                </View>
                <Text style={styles.mensagem}>
                    {this.state.mensagem}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    form: {
        width: width * 0.8,
    },
    input: {
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    titulo:	{
        fontWeight: 'bold',
        fontSize: 26,
    },
    mensagem: {
        marginTop: 15,
        color: '#e74c3c'
    },
});
