import React, { useRef, useEffect, useState } from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import { backendUrl } from 'params';
import '../App.css'
import Header from './Header';
import PumpCard from './PumpCard';

const cord = d => d[0] + d[1] / 60 + (d[2] ?? 0) / 3600;
export default function MapLoader(props) {
    useEffect(() => {
        fetchAllPumps();

    })

    const { match } = props;

    const id = (match) ? match.params.id ?? 0 : 0;
    const [pumps, setAllPumps] = useState([]);
    const [center, setCenter] = useState([3.11, 35.60])
    const fetchPump = async (id) => {
        const pump = await fetch(`${backendUrl}/pump?pumpId=` + id);
        const res = await pump.json();

        return res;
    }
    const fetchAllPumps = async () => {
        const res = await fetch(`${backendUrl}/getAllIds`);
        const pList = await res.json();
        const pInfo = await Promise.all(pList.map(id => fetchPump(id)));
        const pFilter = pInfo.filter(pump => (pump.northings && pump.eastings));

        if (id) {
            const p = pFilter.filter(x => x.id == id)[0];
            setCenter([cord(p.northings), cord(p.eastings)]);
        }
        else {

            const p = pFilter.map(x => {
                return {
                    n: cord(x.northings.split(" ").map(x => parseInt(x, 10))),
                    e: cord(x.eastings.split(" ").map(x => parseInt(x, 10)))
                }
            });
            const ac = p.reduce((a, c) => { return [a[0] + c.n, a[1] + c.e] }, [0, 0]);
            setCenter([ac[0] / p.length, ac[1] / p.length]);

        }

        setAllPumps(pFilter)
    }

    return (
        <React.Fragment>
            <Header title="Map" />
            <Map center={center} zoom={(id) ? 50 : 10}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
                {pumps.map((pump, index) => (

                    <Marker key={index}
                        position={
                            [
                                cord(pump.northings.split(" ").map(x => parseInt(x, 10))),
                                cord(pump.eastings.split(" ").map(x => parseInt(x, 10)))
                            ]
                        }>
                        {
                            <Popup ><PumpCard id={pump.id} onMap></PumpCard></Popup>}
                    </Marker>)

                )}
            </Map>
        </React.Fragment>
    )
}
