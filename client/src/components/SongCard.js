import React, { useContext, useState } from 'react'
import { GlobalStoreContext } from '../store'

function SongCard(props) {
    const { store } = useContext(GlobalStoreContext);

    const { song, index } = props;
    let cardClass = "list-card unselected-list-card";

    const [state, setState] = useState({

            isDragging: false,
            draggedTo: false,
            editActive: false

    })

    function handleDragStart(event){
        event.dataTransfer.setData("song", event.target.id);
        setState(prevState => ({
            isDragging: true,
            draggedTo: prevState.draggedTo
        }));
    }
    function handleDragOver(event){
        event.preventDefault();
        setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    function handleDragEnter(event){
        event.preventDefault();
        setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: true
        }));
    }
    function handleDragLeave(event){
        event.preventDefault();
        setState(prevState => ({
            isDragging: prevState.isDragging,
            draggedTo: false
        }));
    }
    function handleDrop(event){
        event.preventDefault();
        let target = event.target;
        let targetId = target.id;
        targetId = targetId.substring(target.id.indexOf("-") + 1);
        let sourceId = event.dataTransfer.getData("song");
        sourceId = sourceId.substring(sourceId.indexOf("-") + 1);
        
        setState(prevState => ({
            isDragging: false,
            draggedTo: false
        }));


        sourceId = sourceId.charAt(0)

        sourceId = parseInt(sourceId, 10)

        targetId = targetId.charAt(0)

        targetId = parseInt(targetId, 10)

        sourceId++

        targetId++

        console.log(sourceId)

        store.addMoveSongTransaction(sourceId, targetId)
    }

    function handleRemoveSong(){

        store.deleteMarkedSong(index);
    }

    function handleClick(event){

        if (event.detail == 2){

            store.editMarkedSong(index)
        }

    }

    return (
        <div
            key={index}
            id={'song-' + index + '-card'}
            className={cardClass}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            draggable="true"
            onClick={handleClick}
        >
            {index + 1}.
            <a
                id={'song-' + index + '-link'}
                className="song-link"
                href={"https://www.youtube.com/watch?v=" + song.youTubeId}>
                {song.title} by {song.artist}
            </a>
            <input
                type="button"
                id={"remove-song-" + index}
                className="list-card-button"
                value={"\u2715"}
                onClick={handleRemoveSong}
            />
        </div>
    );
}

export default SongCard;