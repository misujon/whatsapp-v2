import { Circle } from 'better-react-spinkit';
import styled from "styled-components";

function Loading() {
    return (
        <LoaderContainer>
            <div>
                <img
                    src="/logo.png"
                    style={{ marginBottom: 10 }}
                    height={200}
                />

                <Circle className="loaderIcon" color="#3CBC28" size={60} />
            </div>
        </LoaderContainer>
    );
}

export default Loading;

const LoaderContainer = styled.div`
    background-image: url('/background.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    background-position: center;
    text-align: center;
    display: flex;
    justify-content: center;
    align-items:center;
    height: 100vh;
    width: 100vw;
`;