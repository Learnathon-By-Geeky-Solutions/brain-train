import { Flex, IconButton } from '@chakra-ui/react';
import { MdHealthAndSafety, MdShoppingCart } from 'react-icons/md';
import './Toolbar.css';
import PropTypes from 'prop-types';

function Toolbar({click}) {
    return (
        <Flex direction="row" alignItems="center" bg="none" placeContent="center">
            <IconButton aria-label="ingredient" sz="sm" className="toolbar tool" onClick={click[0]} >
                <Flex direction="row" alignItems="center" padding="5px">
                    <MdShoppingCart color="var(--neon-green)"/>
                    Search by ingredient
                </Flex>
            </IconButton>
            <IconButton aria-label="ingredient" className="toolbar tool" sz="sm">
            <Flex direction="row" alignItems="center" padding="5px">
                <MdHealthAndSafety color="var(--neon-orange)"/>
                Search by nutritions
            </Flex>
            </IconButton>
            <IconButton aria-label="ingredient" sz="sm" className="toolbar tool">
                <Flex direction="row" alignItems="center" padding="5px">
                    <MdShoppingCart color="var(--neon-pink)"/>
                    Search by ingredient
                </Flex>
            </IconButton>
        </Flex>
    )
}
Toolbar.propTypes = {
    click: PropTypes.arrayOf(PropTypes.func).isRequired,
};

export default Toolbar;