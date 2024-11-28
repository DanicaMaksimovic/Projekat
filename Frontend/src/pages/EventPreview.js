import { useParams } from "react-router";



const EventPreview = () =>{
    let params = useParams();
    let id = params.eventId;
    return <>
        EVENT PREVIEW {id}
    </>
}


export default EventPreview;