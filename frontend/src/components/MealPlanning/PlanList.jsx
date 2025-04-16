import {
  List,
  Menu,
  Portal,
} from '@chakra-ui/react';

import { useColorModeValue } from '../ui/color-mode';
import { deletePlan } from './api';
import { toaster } from '../ui/toaster';
import { useSearchParams } from 'react-router-dom';


const renderPlanList = (planList, setIsActiveIdx, isActiveIdx, setReload, reload, type, setStartDate=null ) =>
{
    const [searchParams, setSearchParams] = useSearchParams();
    const hoverBg = useColorModeValue('gray.100', 'gray.700');
    const activeBg = useColorModeValue('green.50', 'green.900');
    const activeColor = useColorModeValue('green.700', 'green.200');

    return planList.map((plan,index) => (
    <Menu.Root key={plan.startDate}>
      <Menu.ContextTrigger>
        <List.Item
           bg={isActiveIdx === 20 + index ? activeBg : 'transparent'}
           color={isActiveIdx === 20 + index ? activeColor : undefined}
          _hover={{ bg: hoverBg, cursor: 'pointer' }}
          onClick={() => {
            if(type === 'day'){
              setSearchParams({ time: 'day', date: plan.startDate });
            }
            else{
              setSearchParams({});
              setStartDate(plan.startDate);
            }
            setIsActiveIdx(20+index);
          }}
        >
          {plan.title}
        </List.Item>
      </Menu.ContextTrigger>
    <Portal>
      <Menu.Positioner>
        <Menu.Content>
          <Menu.Item
            onClick={() => {
              toaster.create({title: 'Deleting plan. Please wait...', type: 'loading'});
              deletePlan(plan._id,type).then((data) => {
                if(data.status === 'error'){
                  console.error('Failed to delete plan: ');
                  console.log(data);
                  toaster.dismiss();
                  toaster.create({title: data.msg, type: 'error'});
                }
                else{
                  console.log('Deleted plan: ');
                  console.log(data);
                  setReload(!reload);
                  toaster.dismiss();
                  toaster.create({title: 'Plan deleted successfully', type: 'success'});
                }
              }
              );
            }}
          >
            Delete
          </Menu.Item>
        </Menu.Content>
      </Menu.Positioner>
    </Portal>
    </Menu.Root>
))}

export {renderPlanList};