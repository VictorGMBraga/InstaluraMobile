import React, { Component } from 'react';

import {
    AsyncStorage
} from 'react-native';

export default class InstaluraFetchService {
    static request(recurso, method = 'GET', dados) {
        const uri = 'https://instalura-api.herokuapp.com/api' + recurso;
        return AsyncStorage.getItem('token')
            .then(token => {
                return {
                    method,
                    body: JSON.stringify(dados),
                    headers: new Headers({
                        "Content-type": "application/json",
                        "X-AUTH-TOKEN": token
                    })
                };
            })
            .then(requestInfo => fetch(uri, requestInfo))
            .then(resposta => resposta.json());
    }

    static get(recurso) {
        return InstaluraFetchService.request(recurso);
    }

    static post(recurso, dados) {
        return InstaluraFetchService.request(recurso, 'POST', dados);
    }
}
