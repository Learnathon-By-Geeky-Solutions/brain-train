import { Input, IconButton, Flex, Stack, Badge } from '@chakra-ui/react';
import { LuActivity, LuAirVent, LuAlarmClockCheck, LuSearch } from 'react-icons/lu';

const CentralSearchFrame = ({ feature, featureProps, currentBadges, changeBadges }) => {
    const Feature = feature;
    if(!currentBadges) currentBadges = [];  
    const BadgesJsx = currentBadges.map((badge) => <Badge colorPalette={badge.colorPalette}>{badge.text}</Badge>);
    return (
        <Flex direction="column" width="80%" background="white" borderRadius="3xl" padding="2">
            <Flex direction="row" width="inherit">
            {  BadgesJsx }
            </Flex>
        <Feature {...featureProps} />
        <Flex direction="row">
          <IconButton aria-label="Activity" variant="ghost" borderRadius="full" size="sm" onClick={()=>{
            changeBadges('Activity', 'pink');
          }}>
            <LuActivity colorScheme="dark" />
          </IconButton>
          <IconButton aria-label="Alarm" variant="ghost" borderRadius="full" size="sm" onClick={()=>
            changeBadges('Alarm', 'pink')
          }>
            <LuAlarmClockCheck />
          </IconButton>
          <IconButton aria-label="Alarm" variant="ghost" borderRadius="full" size="sm" onClick={()=>
            changeBadges('Airvent', 'pink')
          }>
            <LuAirVent />
          </IconButton>
          <IconButton aria-label="Alarm" variant="ghost" borderRadius="full" size="sm" marginLeft="auto">
            <LuSearch />
          </IconButton>
        </Flex>
      </Flex>
    )
}

export default CentralSearchFrame;