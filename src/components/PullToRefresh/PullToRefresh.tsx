import { ThemeIcon } from "@mantine/core";
import { IconLoader } from "@tabler/icons-react";
import { usePullToRefresh } from 'use-pull-to-refresh';

const MAXIMUM_PULL_LENGTH = 240;
const REFRESH_THRESHOLD = 180;

const PullToRefresh = ({
    onRefresh = () => { },
}: {
    onRefresh: () => void
}) => {
    const { isRefreshing, pullPosition } = usePullToRefresh({
        onRefresh: onRefresh,
        maximumPullLength: MAXIMUM_PULL_LENGTH,
        refreshThreshold: REFRESH_THRESHOLD,
        isDisabled: false
    });
    return (
        <div
            style={{
                top: (isRefreshing ? REFRESH_THRESHOLD : pullPosition) / 3,
                opacity: isRefreshing || pullPosition > 0 ? 1 : 0
            }}
            className='fixed w-full z-30 p-5 '
        >
            <div
                className={` flex items-center justify-center ${isRefreshing ? 'animate-spin' : ''}`}
                style={!isRefreshing ? { transform: `rotate(${pullPosition}deg)` } : {}}
            >
                <ThemeIcon variant="default" radius={"xl"}>
                    <IconLoader />
                </ThemeIcon>
            </div>
        </div>
    )
}

export default PullToRefresh