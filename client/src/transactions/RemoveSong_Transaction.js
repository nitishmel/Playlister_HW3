import jsTPS_Transaction from "../common/jsTPS.js"
/**
 * RemoveSong_Transaction
 * 
 * This class represents a transaction that works with removing
 * a song. It will be managed by the transaction stack.
 * 
 * @author Nitish Meloottu
 */
export default class RemoveSong_Transaction extends jsTPS_Transaction {
    constructor(initModel, index, title, artist, youTubeId) {
        super();
        this.store = initModel;
        this.index = index;
        this.title = title;
        this.artist = artist;
        this.youTubeId = youTubeId;
    }

    doTransaction() {
        this.store.delete(this.index);
    }
    
    undoTransaction() {
        this.store.addatIndex(this.index, this.title, this.artist, this.youTubeId);
    }
}