import { Paper, Text, Title } from "@mantine/core"
import { useNavigate } from "react-router-dom";


const NoteCard = () => {
    const navigate = useNavigate();
    const handleCardClick = () => {
        navigate("/note/1");
    }
    return (
        <Paper
            withBorder
            shadow="md"
            radius="md"
            p="md"
            onClick={handleCardClick}
            className="cursor-pointer hover:brightness-105"
        >
            <Title order={4}>NoteCard</Title>
            <Text size="sm" lineClamp={2}>
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorum quaerat voluptatum quisquam tempore deserunt sint omnis, excepturi rerum, consequatur molestias saepe, obcaecati velit dolores. Officiis quas soluta quod magnam corporis nobis at quis! Labore assumenda quidem, voluptatibus quasi nemo nostrum sed error ullam eos veritatis fuga asperiores eum, amet ipsum architecto fugiat laborum. Nostrum optio quae quibusdam harum numquam, necessitatibus illo eligendi quis rem, deserunt aspernatur modi fugit magnam unde saepe natus veritatis incidunt fugiat debitis consectetur. Nesciunt illum asperiores atque quaerat reprehenderit velit minus cumque sunt quisquam, optio veritatis cupiditate, maiores alias unde error perspiciatis tempora necessitatibus, pariatur placeat!
            </Text>
        </Paper>
    )
}

export default NoteCard