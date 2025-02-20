import { Flex, Loader, Text } from "@mantine/core"



const Loading = ({
    label,
}: {
    label?: string
}) => {

    return (
        <Flex h="100%" w="100%" justify="center" align="center" direction="column" gap={"md"}>
            {label && <Text c={"dimmed"} size="xs">{label}</Text>}
            <Loader size={"sm"} color="gray" />
        </Flex>
    )
}

export default Loading