import React from 'react';
import styled from 'styled-components';

const CardStyle = styled.section`
background-color: #FFF;
box-shadow: 2.5px 5px 10px rgba(0, 0, 0, 0.2);
border-radius: 5px;
padding: 20px 10px;
border: 1px solid rgba(0, 0, 0, 0.05);
width: 300px;
`;

export default (props) => {
    return (
        <CardStyle>
            {props.children}
        </CardStyle>
    );
}