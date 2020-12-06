import React, { useState, useEffect } from 'react';
import { connect, useSelector, useDispatch } from 'react-redux';
import { selectRooms, updateRoom } from '../../data/slices/tavernSlice';
import { tavernDB } from '../../data/firebase/firebaseConfig';

const TavernListener = ({ taverns, updateRoom }) => {


    // const rooms = useSelector(selectRooms);
    const [tavernArray, setTavernsArray] = useState([]);
    const [rooms, setRooms] = useState({})

    useEffect(() => {
        setTavernsArray(taverns);
        let rooms = {}
        taverns.map(tavern => {
            tavern.rooms.map(room => {
                rooms[`${tavern.name}-${room.name}`] = tavern[room.name]
            })
        })
        setRooms(rooms);
    }, [taverns])



    useEffect(() => {
        tavernArray.map(tavern => {
            tavernDB.doc(`${tavern.name}`)
                .onSnapshot(doc => {
                    let tavernData = doc.data();
                    tavernData.rooms.map(room => {
                        if (tavernData[room.name].length > rooms[`${tavern.name}-${room.name}`].length) {
                            console.log(`Są nowe wiadomości w ${tavern.name}-${room.name}`);
                            let index = tavernData[room.name].length - 1;
                            let data = tavernData[room.name][index];

                        }
                    })
                })
        })
        // return function cleanup() {
        //     unsubscribe()
        // }
    }, [tavernArray])

    return (
        <div className="tavernsEye">

        </div>
    );
}

const MapStateToProps = state => ({
    taverns: state.t.taverns,
})
const MapDispatchToProps = dispatch => ({
    updateRoom: (data) => dispatch(updateRoom(data))
})

export default connect(MapStateToProps, MapDispatchToProps)(TavernListener);