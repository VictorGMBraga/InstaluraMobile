
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

    buscaPorId = idFoto => this.state.fotos.find(foto => foto.id === idFoto);

    atualizaFotos = fotoAtualizada => {
        const fotos = this.state.fotos
            .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto);
        this.setState({fotos});
    }

    like = idFoto => {
        const foto = this.buscaPorId(idFoto);

        let novaLista = [];
        if(!foto.likeada) {
            novaLista = [
                ...foto.likers,
                {login: 'meuUsuario'}
            ];
        } else {
            novaLista = foto.likers.filter(liker => {
                return liker.login !== 'meuUsuario';
            });
        }

        const fotoAtualizada = {
            ...foto,
            likeada: !foto.likeada,
            likers: novaLista,
        }
        
        this.atualizaFotos(fotoAtualizada);
    }

    adicionaComentario = (idFoto, valorComentario, inputComentario) => {
        if (valorComentario === '')
            return;

        const foto = this.buscaPorId(idFoto);

        const novaLista = [...foto.comentarios, {
            id: valorComentario,
            login: 'meuUsuario',
            texto: valorComentario,
        }];

        const fotoAtualizada = {
            ...foto,
            comentarios: novaLista,
        }

        this.atualizaFotos(fotoAtualizada);
        inputComentario.clear();
    }

    render() {
        return (
            <FlatList style={styles.container}
                keyExtractor={item => String(item.id)}
                data={this.state.fotos}
                renderItem={ ({item}) =>
                    <Post foto={item}
                        likeCallback={this.like}
                        comentarioCallback={this.adicionaComentario} />
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
