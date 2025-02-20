import { GenericTopBar } from "@/components/TopBars"
import { ActionIcon, Stack, Text, Title } from "@mantine/core"
import { IconBrandGithub } from "@tabler/icons-react"

const About = () => {
    return (
        <>
            <GenericTopBar title="About" />
            <Stack
                w={"100%"}
                align="center"
                justify="center"
                gap={"md"}
                p={"md"}
            >
                <Title >ViteNote</Title>
                <Text c={"dimmed"} size="xs">v{__APP_VERSION__}</Text>

                <ActionIcon component="a" variant="default" size="input-sm" href="https://github.com/clod44/vitenote" target="_blank">
                    <IconBrandGithub />
                </ActionIcon>
            </Stack>
        </>
    )
}

export default About