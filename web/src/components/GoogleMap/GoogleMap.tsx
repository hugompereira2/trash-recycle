import { useEffect, useRef, ReactElement, useState } from "react";
import { Wrapper, Status } from "@googlemaps/react-wrapper";

interface GoogleMapsProps {
    position: [number, number];
}

const render = (status: Status): ReactElement => {
    if (status === Status.LOADING) return <h3>{status} ..</h3>;
    if (status === Status.FAILURE) return <h3>{status} ...</h3>;
    return <div></div>;
};
function MyMapComponent({
    center,
    zoom,
    position,
}: {
    center: google.maps.LatLngLiteral;
    zoom: number;
    position: google.maps.LatLngLiteral;
}) {
    const mapRef = useRef<HTMLDivElement>(null);
    const directionsService = useRef<google.maps.DirectionsService>();
    const directionsRenderer = useRef<google.maps.DirectionsRenderer>();

    useEffect(() => {
        if (mapRef.current) {
            const map = new window.google.maps.Map(mapRef.current, {
                center,
                zoom,
                disableDefaultUI: true,
            });

            directionsService.current = new window.google.maps.DirectionsService();
            directionsRenderer.current = new window.google.maps.DirectionsRenderer({
                map,
            });

            const request: google.maps.DirectionsRequest = {
                origin: center, // Ponto de partida
                destination: position, // Destino
                travelMode: google.maps.TravelMode.DRIVING, // Modo de viagem (pode ser DRIVING, WALKING, etc.)
            };

            // Faça a solicitação para o DirectionsService
            directionsService.current.route(request, (result, status) => {
                if (status === google.maps.DirectionsStatus.OK) {
                    // Renderize a rota no mapa
                    directionsRenderer.current?.setDirections(result);
                } else {
                    console.error("Erro ao calcular a rota:", status);
                }
            });
        }
    }, [center, zoom, position]);

    return <div ref={mapRef} id="map" style={{ width: "100%", height: "400px" }} />;
}

function GoogleMaps(props: GoogleMapsProps) {
    const [center, setCenter] = useState<[number, number]>([0, 0]);

    useEffect(() => {
        navigator.geolocation.getCurrentPosition((position) => {
            const { latitude, longitude } = position.coords;
            setCenter([latitude, longitude]);
        });
    }, [props.position])

    const zoom = 17;

    const isPositionValid = props.position[0] !== 0 && props.position[1] !== 0;
    const isCenterValid = center[0] !== 0 && center[1] !== 0;

    return (
        isPositionValid && isCenterValid ? (
            <Wrapper apiKey="AIzaSyDcd6-rWc8GG0f-g1iVPUR-NUt1gwZEJsE" render={render}>
                <MyMapComponent
                    center={{
                        lat: center[0],
                        lng: center[1],
                    }} zoom={zoom} position={{
                        lat: props.position[0],
                        lng: props.position[1],
                    }}
                />
            </Wrapper>
        ) : null

    );
}

export default GoogleMaps;
