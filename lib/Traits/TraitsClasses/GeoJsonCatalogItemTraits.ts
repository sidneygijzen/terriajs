import { JsonObject } from "../../Core/Json";
import anyTrait from "../Decorators/anyTrait";
import objectArrayTrait from "../Decorators/objectArrayTrait";
import primitiveTrait from "../Decorators/primitiveTrait";
import { traitClass } from "../Trait";
import mixTraits from "../mixTraits";
import ApiRequestTraits from "./ApiRequestTraits";
import CesiumIonTraits from "./CesiumIonTraits";
import { GeoJsonTraits } from "./GeoJsonTraits";

@traitClass({
  description: `Creates one catalog item from url that points to a geojson file.`,
  example: {
    type: "geojson",
    url: "https://tiles.terria.io/terriajs-examples/geojson/bike_racks.geojson",
    name: "geojson example",
    id: "some unique ID"
  }
})
export default class GeoJsonCatalogItemTraits extends mixTraits(
  GeoJsonTraits,
  ApiRequestTraits,
  CesiumIonTraits
) {
  @objectArrayTrait({
    type: ApiRequestTraits,
    name: "URLs",
    idProperty: "url",
    description:
      "Array of GeoJSON URLs to fetch. The GeoJSON features from the URL responses will be merged into one single FeatureCollection. When this trait is specified, the `url` trait is ignored."
  })
  urls?: ApiRequestTraits[];

  @anyTrait({
    name: "geoJsonData",
    description: "A geojson data object"
  })
  geoJsonData?: JsonObject;

  @primitiveTrait({
    type: "string",
    name: "geoJsonString",
    description: "A geojson string"
  })
  geoJsonString?: string;

  @primitiveTrait({
    name: "Response geosjon path",
    type: "string",
    description:
      "Path to geojson in response. If API response is a list of json objects, this should be the path to the geojson within each object in the list."
  })
  responseGeoJsonPath?: string;
}
