
import React, { Component } from 'react';
import { FlatList, StyleSheet, AsyncStorage } from 'react-native';
import Post from './Post';
import FetchInstaluraService from '../services/FetchInstaluraService';

export default class Feed extends Component {

    constructor() {
        super();
        this.state = {
            fotos: []
        }
    }

    componentDidMount() {
        FetchInstaluraService.get('/fotos')
            .then(json => this.setState({ fotos: json }));
    }

    buscaPorId = idFoto => this.state.fotos.find(foto => foto.id === idFoto);

    atualizaFotos = fotoAtualizada => {
        const fotos = this.state.fotos
            .map(foto => foto.id === fotoAtualizada.id ? fotoAtualizada : foto);
        this.setState({fotos});
    }

    like = (idFoto) => {
        const foto = this.buscaPorId(idFoto);
        AsyncStorage.getItem('usuario')
            .then(usuarioLogado => {
                let novaLista = [];
                if (!foto.likeada) {
                    novaLista = [
                        ...foto.likers,
                        { login: usuarioLogado }
                    ];
                } else {
                    novaLista = foto.likers.filter(liker => {
                        return liker.login !== usuarioLogado
                    });
                }
                return novaLista;
            })
            .then(novaLista => {
                const fotoAtualizada = {
                    ...foto,
                    likeada: !foto.likeada,
                    likers: novaLista
                };
                this.atualizaFotos(fotoAtualizada);
            });

        FetchInstaluraService.post(`/fotos/${idFoto}/like`);
    }

    adicionaComentario = (idFoto, valorComentario, inputComentario) => {
        if (valorComentario === '')
            return;

        const foto = this.buscaPorId(idFoto);

        const comentario = {
            texto: valorComentario
        };

        FetchInstaluraService.post(`/fotos/${idFoto}/comment`, comentario)
            .then(comentario => [...foto.comentarios, comentario])
            .then(novaLista => {
                const fotoAtualizada = {
                    ...foto,
                    comentarios: novaLista
                }
                this.atualizaFotos(fotoAtualizada);
                inputComentario.clear();
            });
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
        )
    }
}

const styles = StyleSheet.create({
    container: {
        marginTop: 20,
    },
});
