import { ChatWindow } from './ChatWindow';
import { Box, Text, UnorderedList, ListItem } from "@chakra-ui/react";


export default function ChatPage() {

    const LegalSimplifierCard = (
        <Box p={4} rounded="md"  w="full" maxH="85%" overflow="hidden">
            <Text fontSize="3xl" mb={4}>
                📜 Simplifying Database Optimization with SQL Optimizer
            </Text>
            <UnorderedList>
                <ListItem>
                    <Text ml={2}>
                        🤝 Welcome! I'm your SQL optimizer, here to assist you in optimizing your database queries. Simply provide me with your table structure, and I'll suggest indexes and help you enhance your existing SQL queries for improved performance.
                    </Text>
                </ListItem>
                <ListItem>
                    <Text ml={2}>
                        🛠️ I'll focus on identifying areas where your database can be optimized, including recommending the appropriate indexes to speed up query execution.
                    </Text>
                </ListItem>
                <ListItem>

                    <Text ml={2}>
                        💻  You can count on me to simplify the database optimization process, just provide the necessary information, and I'll do the rest to enhance your database performance.
                    </Text>
                </ListItem>
                <ListItem>
                    
                    <Text ml={2}>
                        {`🤖 Let's get started! Think of me as your database optimization assistant. I'll help you fine-tune your SQL queries for better efficiency, but you can customize the optimization to match your preferences.`}
                    </Text>
                </ListItem>
                <ListItem fontSize="lg">
                    
                    <Text ml={2}>👇 Share your table structure, and I'll suggest indexes and optimize your queries for improved database performance!</Text>
                </ListItem>
                <ListItem fontSize="lg">
                    
                    <Text ml={2}>
                        <strong>🚫 Keep in mind that my recommendations are for optimization purposes and not a substitute for professional database advice. Consult a database expert for specific guidance.</strong>
                    </Text>
                </ListItem>
            </UnorderedList>
        </Box>

    );

    return (
        <ChatWindow
            endpoint="/api/v1/chat/retrieval"
            emptyStateComponent={LegalSimplifierCard}
            showIngestForm={true}
            placeholder={"Start asking to optimize your database!"}
            emoji="🤖"
            titleText="SQL Optimizer"
        ></ChatWindow>
    );
}
