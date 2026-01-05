import { 
    Container, Heading, VStack, Grid, GridItem, Input, InputGroup, 
    InputLeftElement, Box, Text, Button, Badge, HStack, Flex 
} from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { FaSearch, FaNotesMedical } from 'react-icons/fa';
import { AnimatePresence, motion } from 'framer-motion';

import { Cart } from './Cart'; 
import { PatientInfoModal } from './PatientInfoModal';
import { PatientCountModal } from './PatientCountModal';


interface HealthPlan { 
    id: string; 
    name: string; 
    price: number; 
    description: string; 
    prerequisite: string; 
    testCount: number;    
    tags: string[];       
}

interface Patient { name: string; age: string; gender: string; }
interface CartItem extends HealthPlan { cartId: string; patients: Patient[]; }

const allHealthPlans: HealthPlan[] = [
    { 
        id: 'plan-basic', 
        name: 'Basic Wellness', 
        price: 900, 
        description: 'Foundation package covering Sugar, Thyroid, Lipid, Liver & Kidney profiles.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 25, 
        tags: ['Wellness', 'Starter']
    },
    { 
        id: 'plan-advanced', 
        name: 'Advanced Checkup', 
        price: 1400, 
        description: 'Enhanced care with CBC, HbA1c & Urine Routine added to Basic Wellness.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 45, 
        tags: ['Popular', 'Advanced']
    },
    { 
        id: 'plan-comp', 
        name: 'Comprehensive Scan', 
        price: 1700, 
        description: 'Thorough scan including ESR & Vitamin B12 on top of Advanced Checkup.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 55, 
        tags: ['Comprehensive']
    },
    { 
        id: 'plan-vit', 
        name: 'Vitamin & Mineral Focus', 
        price: 2000, 
        description: 'Includes all Comprehensive tests plus Vitamin D3 for total mineral health.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 60, 
        tags: ['Vitamin', 'Focus']
    },
    { 
        id: 'plan-total', 
        name: 'Total Health Package', 
        price: 3000, 
        description: 'Our most extensive package covering every available test parameter.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 85, 
        tags: ['Total Care', 'Premium']
    },

    { 
        id: 'p1', name: 'Aarogya Basic Care', price: 999, 
        description: 'Essential screening for general health maintenance.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 35, tags: ['Popular', 'Men', 'Women']
    },
    { 
        id: 'p2', name: 'Complete Body Profile', price: 2499, 
        description: 'Comprehensive checkup covering Liver, Kidney, Heart & Thyroid.', 
        prerequisite: '🕒 10-12 hours fasting required.',
        testCount: 72, tags: ['Recommended', 'Age 30+']
    },
    { 
        id: 'p3', name: 'Senior Citizen Advanced', price: 3500, 
        description: 'Specialized care including Bone health and Iron studies.', 
        prerequisite: '🕒 12 hours fasting required.',
        testCount: 85, tags: ['Senior', 'Comprehensive']
    },
    { 
        id: 'p4', name: 'Women Wellness Pkg', price: 2100, 
        description: 'Tailored for women including hormonal and vitamin profiles.', 
        prerequisite: '✅ Fasting not required.',
        testCount: 45, tags: ['Women', 'Specialized']
    },
    { 
        id: 'p5', name: 'Diabetes Care Premium', price: 1800, 
        description: 'Deep dive into diabetic markers and organ health.', 
        prerequisite: '🕒 8-10 hours fasting required.',
        testCount: 50, tags: ['Chronic Care']
    }
];

const PlanCard = ({ plan, cartItem, onAdd, onUpdateQuantity }: { plan: HealthPlan, cartItem?: CartItem, onAdd: () => void, onUpdateQuantity: (q: number) => void }) => {
    const quantity = cartItem ? cartItem.patients.length : 0;

    return (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <Box p={5} borderWidth="1px" borderRadius="xl" bg="white" shadow="sm" _hover={{ shadow: 'md', borderColor: 'blue.400' }} transition="all 0.2s">
                <Grid templateColumns={{ base: '1fr', md: '1fr auto' }} gap={4}>
                    <Box>
                        <HStack mb={2} spacing={2}>
                            {plan.tags.map(tag => (
                                <Badge key={tag} colorScheme={tag === 'Popular' ? 'orange' : 'blue'} variant="subtle" borderRadius="full" px={2} fontSize="xs">
                                    {tag}
                                </Badge>
                            ))}
                        </HStack>
                        
                        <Heading size="md" mb={1} color="gray.700">{plan.name}</Heading>
                        <Text color="gray.500" fontSize="sm" mb={3} noOfLines={2}>{plan.description}</Text>
                        
                        <HStack spacing={3} fontSize="xs" color="gray.500" divider={<Text color="gray.300">|</Text>}>
                            <HStack><FaNotesMedical /><Text fontWeight="600">{plan.testCount} Tests</Text></HStack>
                            <Text>{plan.prerequisite}</Text>
                        </HStack>
                    </Box>

                    <Flex direction="column" align={{ base: 'flex-start', md: 'flex-end' }} justify="space-between" minW="120px">
                        <Heading size="lg" color="blue.600">₹{plan.price}</Heading>
                        
                        <Box mt={4} width="full">
                            {quantity === 0 ? (
                                <Button 
                                    backgroundColor='#ADD8E6' 
                                    color="black" 
                                    _hover={{
                                        color:'white', 
                                        backgroundColor: '#384a5c', 
                                        borderWidth:'1px', 
                                        borderColor: '#31373C'
                                    }} 
                                    onClick={onAdd}
                                    width="full"
                                >
                                    Add
                                </Button>
                            ) : (
                                <HStack width="full" justify="flex-end">
                                    <Button size="sm" onClick={() => onUpdateQuantity(quantity - 1)}>-</Button>
                                    <Text fontWeight="bold" width="20px" textAlign="center">{quantity}</Text>
                                    <Button size="sm" onClick={() => onUpdateQuantity(quantity + 1)}>+</Button>
                                </HStack>
                            )}
                        </Box>
                    </Flex>
                </Grid>
            </Box>
        </motion.div>
    );
};


export const HealthPlansPage = () => {
    // State
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPatientInfoModalOpen, setIsPatientInfoModalOpen] = useState(false);
    const [isPatientCountModalOpen, setIsPatientCountModalOpen] = useState(false);
    
    const [selectedPlan, setSelectedPlan] = useState<HealthPlan | null>(null);
    const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
    const [patientCount, setPatientCount] = useState(1);

    // Handlers
    const handleAddClick = (plan: HealthPlan) => {
        setSelectedPlan(plan);
        setIsPatientCountModalOpen(true);
    };

    const handleConfirmPatientCount = () => {
        if (!selectedPlan) return;
        const patients: Patient[] = Array.from({ length: patientCount }, () => ({ name: '', age: '', gender: '' }));
        const cartId = `${selectedPlan.id}-${Date.now()}`;

        setEditingCartItem({ ...selectedPlan, cartId, patients });
        setIsPatientInfoModalOpen(true);
        setIsPatientCountModalOpen(false);
        setPatientCount(1);
    };

    const handleSavePatientInfo = (cartId: string, patients: Patient[]) => {
        const itemExists = cart.some(item => item.cartId === cartId);
        if (itemExists) {
            setCart(prev => prev.map(item => item.cartId === cartId ? { ...item, patients } : item));
        } else {
            setCart(prev => [...prev, { ...editingCartItem!, cartId, patients }]);
        }
        setIsPatientInfoModalOpen(false);
        setEditingCartItem(null);
    };

    const updateQuantity = (cartId: string, newQuantity: number) => {
        const item = cart.find(item => item.cartId === cartId);
        if (!item) return;

        if (newQuantity === 0) {
            setCart(prev => prev.filter(i => i.cartId !== cartId));
            return;
        }
        
        if (newQuantity > item.patients.length) {
            const newPatients = [...item.patients];
            while (newPatients.length < newQuantity) {
                newPatients.push({ name: '', age: '', gender: '' });
            }
            setEditingCartItem({ ...item, patients: newPatients });
            setIsPatientInfoModalOpen(true);
        } else {
            setCart(prev => prev.map(i => i.cartId === cartId ? { ...i, patients: i.patients.slice(0, newQuantity) } : i));
        }
    };
  
    const removeFromCart = (cartId: string) => setCart(prev => prev.filter(item => item.cartId !== cartId));
    
    const handleEditInfo = (cartItem: any) => {
        setEditingCartItem(cartItem);
        setIsPatientInfoModalOpen(true);
    };

    const filteredPlans = useMemo(() => allHealthPlans.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

    return (
        <>
            <Container maxW="container.xl" py={10}>
                <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={10}>
                    <GridItem>
                        <VStack spacing={8} align="stretch">
                            <Box>
                                <Heading>Health Checkup Packages</Heading>
                                <Text color="gray.500" mt={2}>Save up to 40% with our comprehensive bundles</Text>
                            </Box>
                            
                            <InputGroup>
                                <InputLeftElement pointerEvents="none"><FaSearch color="gray.300" /></InputLeftElement>
                                <Input 
                                    placeholder="Search for health packages..." 
                                    value={searchTerm} 
                                    onChange={(e) => setSearchTerm(e.target.value)} 
                                    borderRadius="full"
                                />
                            </InputGroup>

                            <VStack spacing={4} align="stretch">
                                <AnimatePresence>
                                    {filteredPlans.map((plan) => {
                                        const cartItem = cart.find(item => item.id === plan.id);
                                        return (
                                            <PlanCard
                                                key={plan.id}
                                                plan={plan}
                                                cartItem={cartItem}
                                                onAdd={() => handleAddClick(plan)}
                                                onUpdateQuantity={(newQuantity) => {
                                                    if (cartItem) updateQuantity(cartItem.cartId, newQuantity);
                                                }}
                                            />
                                        );
                                    })}
                                </AnimatePresence>
                            </VStack>
                        </VStack>
                    </GridItem>
                    
                    <GridItem position="relative">
                        <Cart cart={cart} onRemove={removeFromCart} onEditInfo={handleEditInfo} />
                    </GridItem>
                </Grid>
            </Container>
            
            {selectedPlan && (
                <PatientCountModal
                    isOpen={isPatientCountModalOpen}
                    onClose={() => setIsPatientCountModalOpen(false)}
                    onConfirm={handleConfirmPatientCount}
                    patientCount={patientCount}
                    setPatientCount={setPatientCount}
                />
            )}

            {editingCartItem && (
                <PatientInfoModal
                    isOpen={isPatientInfoModalOpen}
                    onClose={() => setIsPatientInfoModalOpen(false)}
                    cartItem={editingCartItem}
                    onSave={handleSavePatientInfo}
                />
            )}
        </>
    );
};