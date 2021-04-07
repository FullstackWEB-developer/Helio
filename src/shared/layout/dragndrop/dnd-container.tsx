import React, {ReactNode, Suspense, useState} from 'react'
import {useDrop, XYCoord} from 'react-dnd'
import {DndItemTypes} from './dnd-item-types'
import update from 'immutability-helper'
import {DragItem} from './dnd-interfaces'
import utils from '../../utils/utils';
import ThreeDots from '../../components/skeleton-loader/skeleton-loader';
import HotSpots from '../../../pages/appointments/components/hot-spots';
import {useSelector} from 'react-redux';
import {selectIsHotspotsVisible} from '../store/layout.selectors';

const Ccp = React.lazy(() => import('../../../pages/ccp/ccp'));

export interface ContainerProps {
    className: string
    children: ReactNode;
}

export interface ContainerState {
    boxes: { [key: string]: { top: number; left: number; } }
}

export const DndContainer: React.FC<ContainerProps> = ({children} : ContainerProps) => {
    const {x, y} = utils.getWindowCenter();
    const displayHotspots = useSelector(selectIsHotspotsVisible);

    const [boxes, setBoxes] = useState<{
        [key: string]: {
            top: number
            left: number
        }
    }>({
        a: {top: y - 260, left: x - 168}
    });

    const [, drop] = useDrop({
        accept: DndItemTypes.BOX,
        drop(item: DragItem, monitor) {
            const delta = monitor.getDifferenceFromInitialOffset() as XYCoord
            const left = Math.round(item.left + delta.x)
            const top = Math.round(item.top + delta.y)
            moveBox(item.id, left, top)
            return undefined
        },
    })

    const moveBox = (id: string, left: number, top: number) => {
        setBoxes(
            update(boxes, {
                [id]: {
                    $merge: { left, top },
                },
            }),
        )
    }

    return (
        <div ref={drop} className='h-full w-full'>
            {displayHotspots && <HotSpots/>}
            {children}
            {Object.keys(boxes).map((key) => {
                const { left, top } = boxes[key]
                return (
                    <Suspense
                        key={key}
                        fallback={<ThreeDots />}>
                        <Ccp
                            id={key}
                            left={left}
                            top={top}
                        />
                    </Suspense>
                )
            })}
        </div>
    )
}
