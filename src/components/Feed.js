
import React, { Component } from 'react';
import { FlatList, StyleSheet } from 'react-native';
import Post from './Post';

export default class Feed extends Component {

    constructor() {
        super();
        this.state = {
            fotos: []
        }
    }

    componentDidMount() {
        //fetch('https://instalura-api.herokuapp.com/api/public/fotos/rafael')
        //    .then(resposta => resposta.json())
        //    .then(json => this.setState({fotos: json}));
        this.apiFetch();
    }

    async apiFetch() {
        const resposta = await fetch('https://instalura-api.herokuapp.com/api/public/fotos/rafael');
        const json = await resposta.json();
        this.setState({fotos: json});
    }

    render() {
        return (
            <FlatList style={styles.container}
                keyExtractor={item => String(item.id)}
                data={this.state.fotos}
                renderItem={ ({item}) =>
                    <Post foto={item} />
                }
            />
        );
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
});
