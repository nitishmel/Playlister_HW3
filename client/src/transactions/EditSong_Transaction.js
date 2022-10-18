import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * EditSong_Transaction
 * 
 * This class represents a transaction that works with editing
 * a song. It will be managed by the transaction stack.
 * 
 * @author Nitish Meloottu
 */
export default class EditSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, index, title, artist, youTubeId, song) {
        super();
        this.store = initModel;
        this.index = index;
        this.title = title;
        this.artist = artist;
        this.youTubeId = youTubeId;
        this.song = song;
    }

    doTransaction() {
        this.store.editSong(this.index, this.title, this.artist, this.youTubeId);
    }
    

    undoTransaction() {
        this.store.editSong(this.index, this.song.title, this.song.artist, this.song.youTubeId);
    }
}