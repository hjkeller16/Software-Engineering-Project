import { Component, OnInit } from '@angular/core';

declare const L;

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition(function (location) {
      let latlng = new L.LatLng(location.coords.latitude, location.coords.longitude);
      let mymap = L.map('map').setView(latlng, 13);
      mymap.on('load', () => {
        document.getElementById('map-loading-indicator').style.display = 'none';
      });
      L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=sk.eyJ1IjoiYW5uYWJhaWVyIiwiYSI6ImNqbmZ5OGczazA0dGczcHFubjh2MzhlNjcifQ.fgI9fzYtKDB3ZNNogLOyRA', {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'sk.eyJ1IjoiYW5uYWJhaWVyIiwiYSI6ImNqbmZ5OGczazA0dGczcHFubjh2MzhlNjcifQ.fgI9fzYtKDB3ZNNogLOyRA'
      }).addTo(mymap);
      L.marker(latlng).addTo(mymap);
    });
  }
}