import jsTPS_Transaction from "../common/jsTPS.js"

import React, { Component } from 'react';
import { useContext } from 'react'
import { GlobalStoreContext } from '../store'
import { useHistory } from 'react-router-dom'
/**
 * AddSong_Transaction
 * 
 * This class represents a transaction that works with adding
 * a song. It will be managed by the transaction stack.
 * 
 * @author Nitish Meloottu
 */
export default class AddSong_Transaction extends jsTPS_Transaction {
    constructor(initModel) {

        super();
        this.store = initModel;
    }

    doTransaction() {
        this.store.add();
    }
    
    undoTransaction() {
        let len = this.store.getPlaylistSize();
        this.store.delete(len - 1);
    }
}