import React, { useState, useEffect } from 'react';
import { connect, useSelector } from 'react-redux';
import { selectRooms, updateRoom, selectPlayersIn, updateSingleTavern, showPlayers, fetchTaverns } from '../../data/slices/tavernSlice';
import { tavernDB } from '../../data/firebase/firebaseConfig';
import _ from 'lodash'

const TavernListener = ({ taverns, updateRoom, updateSingleTavern, showPlayers, fetchTaverns }) => {


    const roomsArray = useSelector(selectRooms);
    const guests = useSelector(selectPlayersIn)
    const [tavernArray, setTavernsArray] = useState([]);
    const [rooms, setRooms] = useState(false)
    const [players, setPlayers] = useState([])

    useEffect(() => {
        // console.log(taverns)
        // console.log(roomsArray)
        // console.log(`Konsola z stworzenia rooms - useEffect`)
        if (taverns.length > 0) {
            // console.log(`Konsola z stworzenia rooms - taverns nie jest puste`)
            setTavernsArray(taverns);
            let rooms = {}
            taverns.map(tavern => {
                tavern.rooms.map(room => {
                    rooms[`${tavern.name}-${room.name}`] = tavern[room.name]
                })
            })
            setRooms(rooms);
        }
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

                        } else {
                            showPlayers(player)
                        }
                    }
                })
            })
        })

    }, [taverns])


    useEffect(() => {
        const unsubscribe = tavernDB.where("id", "==", "0")
            .onSnapshot((querySnapshot) => {
                // console.log("fetchTavern")
                fetchTaverns()

                if (rooms) {
                    // let taverns = [];
                    querySnapshot.forEach((doc, index) => {
                        let tavern = doc.data();

                        console.log(index);

                        tavern.rooms.forEach(room => {
                            // console.log(`forEach w ${tavern.name} dla ${room.name}`)

                            if (tavern[room.name].length > rooms[`${tavern.name}-${room.name}`].length) {
                                console.log(`Jest nowy odpis w ${room.name} w ${tavern.name}`);

                            } else if (tavern[room.name].length === rooms[`${tavern.name}-${room.name}`].length) {
                                console.log(`Żadnego NOWEGO LUB USUNIĘTEGO posta w ${room.name} w ${tavern.name}`)
                            } else if (tavern[room.name].length < rooms[`${tavern.name}-${room.name}`].length) {
                                console.log(`Usunięto post z ${room.name} w ${tavern.name}`)
                            }
                        })


                    })
                    // console.log(taverns);

                }
            })
        return () => {
            unsubscribe();
        }
    }, [])


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
    showPlayers: players => dispatch(showPlayers(players)),
    fetchTaverns: () => dispatch(fetchTaverns())
})

export default connect(MapStateToProps, MapDispatchToProps)(TavernListener);