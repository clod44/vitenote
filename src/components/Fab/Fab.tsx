import { ActionIcon, ActionIconProps } from "@mantine/core";

//TODO: polymorph properly.
interface FabProps extends ActionIconProps {
    onClick?: () => void
}

const Fab = ({
    onClick = () => { },
    children,
    ...props
}: FabProps) => {
    return (
        <>
            <div className="fixed bottom-20 right-16 z-40">
                <ActionIcon
                    variant="default"
                    radius={"100%"}
                    size={"input-xl"}
                    className="rounded-full cursor-pointer animate-fade-up animate-duration-[250ms]"
                    onClick={onClick}
                    {...props}
                >
                    {children}
                </ActionIcon>
            </div>
        </>
    );
}

export default Fab;
