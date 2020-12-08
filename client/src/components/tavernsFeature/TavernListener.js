import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectRooms, updateRoom, selectPlayersIn, updateSingleTavern, showPlayers } from '../../data/slices/tavernSlice';
import { tavernDB } from '../../data/firebase/firebaseConfig';
import _ from 'lodash'

const TavernListener = ({ taverns, updateRoom, updateSingleTavern, showPlayers }) => {


    const roomsArray = useSelector(selectRooms);
    const guests = useSelector(selectPlayersIn)
    const [tavernArray, setTavernsArray] = useState([]);
    const [rooms, setRooms] = useState({})
    const [players, setPlayers] = useState([])

    useEffect(() => {
        setTavernsArray(taverns);
        let rooms = {}
        taverns.map(tavern => {
            tavern.rooms.map(room => {
                rooms[`${tavern.name}-${room.name}`] = tavern[room.name]
            })
        })
        setRooms(rooms);
    }, [taverns, roomsArray])


    useEffect(() => {
        let now = new Date().getTime();
        let min5ago = now - 300000;

        let playersIn = [];
        if (guests.length > 0) playersIn = guests;
        taverns.map(tavern => {
            tavern.rooms.map(room => {
                tavern[room.name].map(record => {
                    if (record.ID > min5ago) {
                        let player = {
                            name: record.author.name,
                            tavern: tavern.name,
                            room: room.name
                        }
                        if (_.includes(playersIn, `${player.name}`)) {
                            console.log("Gracz jest już w tablicy.")
                        } else {
                            console.log("Gracz nie jest w tablicy")
                            showPlayers(player)
                        }
                    }
                })
            })
        })

    }, [taverns])


    useEffect(() => {
        tavernArray.map(tavern => {
            tavernDB.doc(`${tavern.name}`)
                .onSnapshot(doc => {
                    let tavernData = doc.data();
                    tavernData.rooms.map(room => {
                        if (tavernData[room.name].length > roomsArray[`${tavern.name}-${room.name}`].length) {
                            let name = `${tavern.name}-${room.name}`
                            let data = tavernData[room.name];
                            let record = {
                                name,
                                data
                            }
                            updateSingleTavern(tavernData)
                            updateRoom(record)
                        }
                    })
                })
        })
        // return function cleanup() {
        //     unsubscribe()
        // }
    }, [tavernArray])

    const playersInTavern = players.map(player => ((
        <div key={player.name}>
            <p>{player.name}</p>
        </div>
    )))

    return (
        <div className="tavernsEye">
            {playersInTavern}
        </div>
    );
}

const MapStateToProps = state => ({
    taverns: state.t.taverns,
    // roomsArrays: state.t.rooms,
})
const MapDispatchToProps = dispatch => ({
    updateRoom: (data) => dispatch(updateRoom(data)),
    updateSingleTavern: tavern => dispatch(updateSingleTavern(tavern)),
    showPlayers: players => dispatch(showPlayers(players))
})

export default connect(MapStateToProps, MapDispatchToProps)(TavernListener);