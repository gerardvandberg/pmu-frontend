import React from 'react'
import {Map, Marker, Popup, TileLayer} from 'react-leaflet';
import {Icon} from 'leaflet';
import '../App.css'

export default function MapLoader() {
    return (
        <Map center={[3.11, 35.60]} zoom={10}>
        <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        </Map>
    )
}
