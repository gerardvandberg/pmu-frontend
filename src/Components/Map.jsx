import React from 'react'
import { Map, Marker, Popup, TileLayer } from 'react-leaflet';
import { Icon } from 'leaflet';
import '../App.css'
import Header from './Header';

export default function MapLoader(props) {
    const pumpId = props.match.parmas.id ?? -1;

    return (
        <React.Fragment>
            <Header title="Map" />
            <Map center={[3.11, 35.60]} zoom={10}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                />
            </Map>
        </React.Fragment>
    )
}
