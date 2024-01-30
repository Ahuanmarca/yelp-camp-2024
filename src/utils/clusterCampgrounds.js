function clusterCampgrounds(campgrounds) {
  const clusterData = {
    type: 'FeatureCollection',
    crs: {
      type: 'name',
      properties: {
        name: 'urn:ogc:def:crs:OGC:1.3:CRS84',
      },
    },
    features: [],
  };
  campgrounds.forEach((campground) => clusterData.features.push(campground));
  return clusterData;
}

export default clusterCampgrounds;

/* 
RECEIVES THE DATA IN THE FOLLOWING FORMAT:

[
  {
    geometry: { type: 'Point', coordinates: [Array] },
    reviews: [],
    _id: new ObjectId("65aff52aa11ed9a741c64fef"),
    title: 'Dusty Hollow',
    price: 100,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
    location: 'Yorba Linda, California',
    author: new ObjectId("65aff528a11ed9a741c64fea"),
    images: [ [Object] ],
    __v: 0
  },
  {
    geometry: { type: 'Point', coordinates: [Array] },
    reviews: [],
    _id: new ObjectId("65aff52aa11ed9a741c64ff2"),
    title: 'Ocean Creek',
    price: 100,
    description: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Quibusdam dolores vero perferendis laudantium, consequuntur voluptatibus nulla architecto, sit soluta esse iure sed labore ipsam a cum nihil atque molestiae deserunt!',
    location: 'San Jose, California',
    author: new ObjectId("65aff528a11ed9a741c64fe4"),
    images: [ [Object] ],
    __v: 0
  },
]

RETURNS THE DATA IN THE FOLLOWING FORMAT:

{
  "type": "FeatureCollection",
  "crs": {
    "type": "name",
    "properties": {
      "name": "urn:ogc:def:crs:OGC:1.3:CRS84"
    }
  },
  "features": [
    {
      "type": "Feature",
      "properties": {
        "id": "ak16994521",
        "mag": 2.3,
        "time": 1507425650893,
        "felt": null,
        "tsunami": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -151.5129,
          63.1016,
          0
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
        "id": "ak16994519",
        "mag": 1.7,
        "time": 1507425289659,
        "felt": null,
        "tsunami": 0
      },
      "geometry": {
        "type": "Point",
        "coordinates": [
          -150.4048,
          63.1224,
          105.5
        ]
      }
    },
  ]
}
*/
