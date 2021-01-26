Vue.view("google-static-map", {
	// https://developers.google.com/maps/documentation/maps-static/start
	props: {
		apiKey: {
			type: String,
			required: true
		},
		height: {
			type: Number,
			default: 400
		},
		radius: {
			type: String
		},
		width: {
			type: Number,
			default: 500
		},
		latitude: {
			type: String
		},
		longitude: {
			type: String
		},
		// png, png8, png32, gif, jpg, jpg-baseline
		format: {
			type: String,
			default: "jpg"
		},
		// roadmap, satellite, hybrid, and terrain
		mapType: {
			type: String,
			default: "roadmap"
		},
		// general zoom levels:
		// 1: World
		// 5: Landmass/continent
		// 10: City
		// 15: Streets
		// 20: Buildings
		zoom: {
			type: Number,
			default: 13
		},
		// can be either 1 or 2, 2 is higher definition
		scale: {
			type: Number,
			default: 1
		},
		// color:blue|label:S|40.702147,-74.015794;color:red|label:T|lat,long...
		// the label can only be one letter? and is optional
		markers: {
			type: String
		}
	},
	computed: {
		queryString: function() {
			var query = 'center=' + this.latitude + ',' + this.longitude + '&zoom=' + this.zoom + '&size=' + this.width + 'x' + this.height + '&scale=' + this.scale
				+ '&format=' + this.format + '&maptype=' + this.mapType;
			if (this.markers) {
				var parts = this.markers.split(";");
				for (var i = 0; i < parts.length; i++) {
					// if we didn't pass in a lat,long we add the one from the center
					if (parts[i].indexOf(",") < 0) {
						parts[i] += "|" + this.latitude + "," + this.longitude;
					}
					query += "&markers=" + parts[i];
				}
			}
			if (this.radius) {
				query += this.circle(this.latitude, this.longitude, this.radius);
			}
			query += "&key=" + this.apiKey;
			return query;
		}
	},
	methods: {
		circle: function(lat, lng, rad, detail, color) {
			if (!detail) {
				detail = 8;
			}
			if (!color) {
				// blue, lots of opacity
				color = "0x0000ff50";
			}
			var path = "&path=color:" + color + "|weight:1|fillcolor:" + color;
			
			var r = 6371;
			
			var pi = Math.PI;
			
			var latRad = (lat * pi) / 180;
			var lngRad = (lng * pi) / 180;
			var d = (rad/1000) / r;
			
			for (var i = 0; i <= 360; i += detail) {
				var brng = i * pi / 180;
				var pLat = Math.asin(Math.sin(latRad) * Math.cos(d) + Math.cos(latRad) * Math.sin(d) * Math.cos(brng));
				var pLng = ((lngRad + Math.atan2(Math.sin(brng) * Math.sin(d) * Math.cos(latRad), Math.cos(d) - Math.sin(latRad) * Math.sin(pLat))) * 180) / pi;
				pLat = (pLat * 180) / pi;
				path += "|" + pLat + "," + pLng;
			}
			return path;
		}
	}
});