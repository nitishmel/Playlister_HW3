import { createContext, useState } from 'react'
import jsTPS from '../common/jsTPS'
import api from '../api'

import MoveSong_Transaction from '../transactions/MoveSong_Transaction.js';
import AddSong_Transaction from '../transactions/AddSong_Transaction.js';
import EditSong_Transaction from '../transactions/EditSong_Transaction.js';
import RemoveSong_Transaction from '../transactions/RemoveSong_Transaction.js';
export const GlobalStoreContext = createContext({});
/*
    This is our global data store. Note that it uses the Flux design pattern,
    which makes use of things like actions and reducers. 
    
    @author McKilla Gorilla
*/


// THESE ARE ALL THE TYPES OF UPDATES TO OUR GLOBAL
// DATA STORE STATE THAT CAN BE PROCESSED
export const GlobalStoreActionType = {
    CHANGE_LIST_NAME: "CHANGE_LIST_NAME",
    CLOSE_CURRENT_LIST: "CLOSE_CURRENT_LIST",
    CREATE_NEW_LIST: "CREATE_NEW_LIST",
    LOAD_ID_NAME_PAIRS: "LOAD_ID_NAME_PAIRS",
    SET_CURRENT_LIST: "SET_CURRENT_LIST",
    SET_LIST_NAME_EDIT_ACTIVE: "SET_LIST_NAME_EDIT_ACTIVE",
    MARK_LIST_FOR_DELETION: "MARK_LIST_FOR_DELETION",
    MARK_SONG_FOR_DELETION: "MARK_SONG_FOR_DELETION",
    MARK_SONG_FOR_EDITING: "MARK_SONG_FOR_EDITING"
}

// WE'LL NEED THIS TO PROCESS TRANSACTIONS
const tps = new jsTPS();

// WITH THIS WE'RE MAKING OUR GLOBAL DATA STORE
// AVAILABLE TO THE REST OF THE APPLICATION
export const useGlobalStore = () => {
    // THESE ARE ALL THE THINGS OUR DATA STORE WILL MANAGE
    const [store, setStore] = useState({
        idNamePairs: [],
        currentList: null,
        newListCounter: 0,
        listNameActive: false,
        markedkeyfordeletion: null,
        markedsongfordeletion: null,
        markedsongforediting: null
    });

    // HERE'S THE DATA STORE'S REDUCER, IT MUST
    // HANDLE EVERY TYPE OF STATE CHANGE
    const storeReducer = (action) => {
        const { type, payload } = action;
        switch (type) {
            // LIST UPDATE OF ITS NAME
            case GlobalStoreActionType.CHANGE_LIST_NAME: {
                return setStore({
                    idNamePairs: payload.idNamePairs,
                    currentList: payload.playlist,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion
                });
            }
            // STOP EDITING THE CURRENT LIST
            case GlobalStoreActionType.CLOSE_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion
                })
            }
            // CREATE A NEW LIST
            case GlobalStoreActionType.CREATE_NEW_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter + 1,
                    listNameActive: false,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion
                })
            }
            // GET ALL THE LISTS SO WE CAN PRESENT THEM
            case GlobalStoreActionType.LOAD_ID_NAME_PAIRS: {
                return setStore({
                    idNamePairs: payload,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion
                });
            }
            // PREPARE TO DELETE A LIST
            case GlobalStoreActionType.MARK_LIST_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: null,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedkeyfordeletion: payload,
                    markedsongfordeletion: store.markedsongfordeletion
                });
            }

            case GlobalStoreActionType.MARK_SONG_FOR_DELETION: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: payload
                });
            }
            // UPDATE A LIST
            case GlobalStoreActionType.SET_CURRENT_LIST: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: false,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion
                });
            }
            // START EDITING A LIST NAME
            case GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: payload,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion
                });
            }
            case GlobalStoreActionType.MARK_SONG_FOR_EDITING: {
                return setStore({
                    idNamePairs: store.idNamePairs,
                    currentList: store.currentList,
                    newListCounter: store.newListCounter,
                    listNameActive: true,
                    markedkeyfordeletion: store.markedkeyfordeletion,
                    markedsongfordeletion: store.markedsongfordeletion,
                    markedsongforediting: payload
                });
            }
            default:
                return store;
        }
    }
    // THESE ARE THE FUNCTIONS THAT WILL UPDATE OUR STORE AND
    // DRIVE THE STATE OF THE APPLICATION. WE'LL CALL THESE IN 
    // RESPONSE TO EVENTS INSIDE OUR COMPONENTS.

    // THIS FUNCTION PROCESSES CHANGING A LIST NAME
    store.changeListName = function (id, newName) {
        // GET THE LIST
        async function asyncChangeListName(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;
                playlist.name = newName;
                async function updateList(playlist) {
                    response = await api.updatePlaylistById(playlist._id, playlist);
                    if (response.data.success) {
                        async function getListPairs(playlist) {
                            response = await api.getPlaylistPairs();
                            if (response.data.success) {
                                let pairsArray = response.data.idNamePairs;
                                storeReducer({
                                    type: GlobalStoreActionType.CHANGE_LIST_NAME,
                                    payload: {
                                        idNamePairs: pairsArray,
                                        playlist: playlist
                                    }
                                });
                            }
                        }
                        getListPairs(playlist);
                    }
                }
                updateList(playlist);
            }
        }
        asyncChangeListName(id);
    }

    // THIS FUNCTION PROCESSES CLOSING THE CURRENTLY LOADED LIST
    store.closeCurrentList = function () {
        storeReducer({
            type: GlobalStoreActionType.CLOSE_CURRENT_LIST,
            payload: {}
        });
    }

    store.createNewList = function () {

        async function asyncCreateNewList() {

            let list = {name: "Untitled-"+ store.newListCounter, songs:[]};

            const response = await api.createPlaylist(list);

            if (response.data.success) {

                let pl = response.data.playlist;

                storeReducer({
                    type: GlobalStoreActionType.CREATE_NEW_LIST,
                    payload: pl 
                });

                store.history.push("/playlist/"+ pl._id);
                
            }
            else {
                console.log("API FAILED TO CREATE PLAYLIST");
            }
        }
        asyncCreateNewList();
    }

    store.deleteList = function () {

        async function asyncdeleteList() {

            const response = await api.deleteList(store.markedkeyfordeletion._id)

            if (response.data.success) {

                store.loadIdNamePairs()
            }
            else {
                console.log("API FAILED TO DELETE PLAYLIST");
            }

            store.hideDeleteListModal();
        }
        asyncdeleteList();
    }

    store.add = function(){

        async function asyncadd(){

        let list = store.currentList

        let song = ({title: "Untitled", artist: "Unknown", youTubeId: "dQw4w9WgXcQ"});

        list.songs.push(song);

        const response = await api.updatePlaylistById(list._id, list)

        if (response.data.success) {

            storeReducer({

                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: list
            })
        }
        else {
            console.log("API FAILED TO ADD SONG");
        }
    }

        asyncadd();
    }

    store.addatIndex = async function(addsongindex, title, artist, youTubeId) {

        let song = ({title: title, artist: artist, youTubeId: youTubeId});

        let list = store.currentList

        list.songs.splice(addsongindex, 0, song);

        const response = await api.updatePlaylistById(list._id, list)

        if (response.data.success) {

            storeReducer({

                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: list
            })
        }
        else {
            console.log("API FAILED TO ADD SONG");
        }
    }

    store.moveSong = async function(start, end) {

        if (start !== end)
        {
            let list = store.currentList;

            // WE NEED TO UPDATE THE STATE FOR THE APP
            start -= 1;
            end -= 1;
            if (start < end) {
                let temp = list.songs[start];
                for (let i = start; i < end; i++) {
                    list.songs[i] = list.songs[i + 1];
                }
                list.songs[end] = temp;
            }
            else if (start > end) {
                let temp = list.songs[start];
                for (let i = start; i > end; i--) {
                    list.songs[i] = list.songs[i - 1];
                }
                list.songs[end] = temp;
            }
            
        const response = await api.updatePlaylistById(list._id, list)

        if (response.data.success) {

            storeReducer({

                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: list
            })
        }
        else {
            console.log("API FAILED TO MOVE SONG");
        }

        }
    }

    store.deleteMarkedList = function(key) {

        storeReducer({

            type: GlobalStoreActionType.MARK_LIST_FOR_DELETION,
            payload: key
        })
            
        store.showDeleteListModal()
    }

    store.deleteMarkedSong = function(index){

        storeReducer({
            
            type: GlobalStoreActionType.MARK_SONG_FOR_DELETION,
            payload: index
        })
        
        store.showDeleteSongModal()

    }

    store.editMarkedSong = function(index){

        storeReducer({
            
            type: GlobalStoreActionType.MARK_SONG_FOR_EDITING,
            payload: index
        })
        
        store.showEditSongModal()
    }

    store.delete = async function(index) {

        let list = store.currentList

        store.currentList.songs.splice(index, 1);

        const response = await api.updatePlaylistById(list._id, list)

        if (response.data.success) {

            storeReducer({

                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: list
            })
        }
        else {
            console.log("API FAILED TO DELETE SONG");
        }

        store.hideDeleteSongModal()
    }

    store.deleteCall = function(){

        let songid = store.markedsongfordeletion;
        let title = store.currentList.songs[songid].title
        let artist = store.currentList.songs[songid].artist;
        let youTubeId = store.currentList.songs[songid].youTubeId;
        store.addRemoveSongTransaction(songid, title, artist, youTubeId)
    }

    store.editCall = function(){

        let songid = store.markedsongforediting;

        let oldtitle = store.currentList.songs[songid].title;
        let oldartist = store.currentList.songs[songid].artist;
        let oldyouTubeId = store.currentList.songs[songid].youTubeId;

        let song = ({title: oldtitle, artist: oldartist, youTubeId: oldyouTubeId});

        let title = document.getElementById("Title").value;
        let artist = document.getElementById("Artist").value;
        let youTubeId = document.getElementById("youTubeId").value;

        store.addEditSongTransaction(songid, title, artist, youTubeId, song)

    }
    store.editSong = async function(songid, title, artist, youTubeId){

        let list = store.currentList

        list.songs[songid].title = title;
        list.songs[songid].artist = artist;
        list.songs[songid].youTubeId = youTubeId;

        const response = await api.updatePlaylistById(list._id, list)

        if (response.data.success) {

            storeReducer({

                type: GlobalStoreActionType.SET_CURRENT_LIST,
                payload: list
            })
        }
        else {
            console.log("API FAILED TO EDIT SONG");
        }

        store.hideEditSongModal()
    }

    store.showDeleteListModal = function(){

        let modal = document.getElementById("delete-list-modal")
        modal.classList.add("is-visible")
    }

    store.hideDeleteListModal = function() {

        let modal = document.getElementById("delete-list-modal")
        modal.classList.remove("is-visible")
    }
    
    store.showDeleteSongModal = function() {

        let modal = document.getElementById("delete-song-modal")
        modal.classList.add("is-visible")
    }

    store.hideDeleteSongModal = function() {

        let modal = document.getElementById("delete-song-modal")
        modal.classList.remove("is-visible")
    }

    store.showEditSongModal = function() {

        let modal = document.getElementById("edit-song-modal")
        modal.classList.add("is-visible")
    }

    store.hideEditSongModal = function() {

        let modal = document.getElementById("edit-song-modal")
        modal.classList.remove("is-visible")
    }

    // THIS FUNCTION LOADS ALL THE ID, NAME PAIRS SO WE CAN LIST ALL THE LISTS
    store.loadIdNamePairs = function () {
        async function asyncLoadIdNamePairs() {
            const response = await api.getPlaylistPairs();
            if (response.data.success) {
                let pairsArray = response.data.idNamePairs;
                storeReducer({
                    type: GlobalStoreActionType.LOAD_ID_NAME_PAIRS,
                    payload: pairsArray
                });
            }
            else {
                console.log("API FAILED TO GET THE LIST PAIRS");
            }
        }
        asyncLoadIdNamePairs();
    }

    store.setCurrentList = function (id) {
        async function asyncSetCurrentList(id) {
            let response = await api.getPlaylistById(id);
            if (response.data.success) {
                let playlist = response.data.playlist;

                if (response.data.success) {
                    storeReducer({
                        type: GlobalStoreActionType.SET_CURRENT_LIST,
                        payload: playlist
                    });
                    store.history.push("/playlist/" + playlist._id);
                }
            }
        }
        asyncSetCurrentList(id);
    }
    store.getPlaylistSize = function() {
        return store.currentList.songs.length;
    }

    store.addAddSongTransaction = () => {
        let transaction = new AddSong_Transaction(store);
        tps.addTransaction(transaction);
    }

    store.addRemoveSongTransaction = (index, title, artist, youTubeId) => {
        let transaction = new RemoveSong_Transaction(store, index, title, artist, youTubeId);
        tps.addTransaction(transaction);  
    }

    store.addEditSongTransaction = (songindex, title, artist, youTubeId, song) => {
        let transaction = new EditSong_Transaction(store, songindex, title, artist, youTubeId, song);
        tps.addTransaction(transaction);
    }

    store.addMoveSongTransaction = (start, end) => {

        if (start !== end)
        {
            let transaction = new MoveSong_Transaction(store, start, end);
            tps.addTransaction(transaction);
        }
    }
    store.undo = function () {

        if (tps.hasTransactionToUndo()){

            tps.undoTransaction();
        }
    }
    store.redo = function () {

        if (tps.hasTransactionToRedo()){

            tps.doTransaction();
        }
    }

    // THIS FUNCTION ENABLES THE PROCESS OF EDITING A LIST NAME
    store.setlistNameActive = function () {
        storeReducer({
            type: GlobalStoreActionType.SET_LIST_NAME_EDIT_ACTIVE,
            payload: null
        });
    }

    // THIS GIVES OUR STORE AND ITS REDUCER TO ANY COMPONENT THAT NEEDS IT
    return { store, storeReducer };
}