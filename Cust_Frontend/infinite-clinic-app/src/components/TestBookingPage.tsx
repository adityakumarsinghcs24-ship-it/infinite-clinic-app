import { Container, Heading, VStack, Grid, GridItem, Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { useState, useMemo } from 'react';
import { FaSearch } from 'react-icons/fa';
import { AnimatePresence } from 'framer-motion';

import { TestCard } from './TestCard';
import { Cart } from './Cart';
import { PatientInfoModal } from './PatientInfoModal';
import { PatientCountModal } from './PatientCountModal';


interface Test { id: string; name: string; price: number; description: string; prerequisite: string; }
interface Patient { name: string; age: string; gender: string; }
interface CartItem extends Test { cartId: string; patients: Patient[]; }

const allTests: Test[] = [
    { id: 't1', name: 'Sugar Fasting', price: 200, description: 'Measures blood sugar to screen for diabetes.', prerequisite: '🕒 8-10 hours fasting required.' },
    { id: 't2', name: 'Thyroid Profile', price: 300, description: 'Evaluates thyroid function and helps diagnose disorders.', prerequisite: '✅ Fasting not required.' },
    { id: 't3', name: 'Lipid Profile Screen', price: 400, description: 'Measures cholesterol to assess heart disease risk.', prerequisite: '🕒 9-12 hours fasting recommended.' },
    { id: 't4', name: 'LFT/KFT', price: 500, description: 'Assesses the health of your liver and kidneys.', prerequisite: '✅ Fasting not required.' },
    { id: 't5', name: 'CBC', price: 600, description: 'Evaluates your blood cells to detect a wide range of disorders.', prerequisite: '✅ Fasting not required.' },
    { id: 't6', name: 'ESR', price: 700, description: 'Helps detect inflammation in the body.', prerequisite: '✅ Fasting not required.' },
    { id: 't7', name: 'HbA1c', price: 800, description: 'Shows average blood sugar over the past 2-3 months.', prerequisite: '✅ Fasting not required.' },
    { id: 't8', name: 'Vitamin B12', price: 900, description: 'Measures B12, essential for nerve function.', prerequisite: '✅ Fasting not required.' },
    { id: 't9', name: 'Vitamin D3', price: 1000, description: 'Measures Vitamin D, vital for bone health.', prerequisite: '✅ Fasting not required.' },
    { id: 't10', name: 'Urine Routine', price: 1100, description: 'Analyzes urine to detect UTIs and kidney disease.', prerequisite: '✅ First morning sample preferred.' },
    { id: 't11', name: 'Iron Studies', price: 1200, description: 'Measures iron levels in your blood and body stores.', prerequisite: '🕒 12 hours fasting recommended.' },
    { id: 't12', name: 'Ferritin', price: 1300, description: 'Checks your body\'s iron stores.', prerequisite: '🕒 12 hours fasting recommended.' },
    { id: 't13', name: 'HBsAg', price: 1400, description: 'Screens for or diagnoses Hepatitis B infection.', prerequisite: '✅ Fasting not required.' },
    { id: 't14', name: 'Free Triiodothyronine', price: 1500, description: 'A specific test to help evaluate thyroid function.', prerequisite: '✅ Fasting not required.' },
    { id: 't15', name: 'Free Thyroxine', price: 1600, description: 'Measures a key thyroid hormone to assess function.', prerequisite: '✅ Fasting not required.' },
];

export const TestBookingPage = () => {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isPatientInfoModalOpen, setIsPatientInfoModalOpen] = useState(false);
    const [editingCartItem, setEditingCartItem] = useState<CartItem | null>(null);
    const [isPatientCountModalOpen, setIsPatientCountModalOpen] = useState(false);
    const [selectedTest, setSelectedTest] = useState<Test | null>(null);
    const [patientCount, setPatientCount] = useState(1);

    const handleAddClick = (test: Test) => {
        setSelectedTest(test);
        setIsPatientCountModalOpen(true);
    };

    const handleConfirmPatientCount = () => {
        if (!selectedTest) return;
        const patients: Patient[] = Array.from({ length: patientCount }, () => ({ name: '', age: '', gender: '' }));
        const cartId = `${selectedTest.id}-${Date.now()}`;

        setEditingCartItem({ ...selectedTest, cartId, patients });
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
    const handleEditInfo = (cartItem: CartItem) => {
        setEditingCartItem(cartItem);
        setIsPatientInfoModalOpen(true);
    };

    const filteredTests = useMemo(() => allTests.filter(t => t.name.toLowerCase().includes(searchTerm.toLowerCase())), [searchTerm]);

    return (
        <>
            <Container maxW="container.xl" py={10}>
                <Grid templateColumns={{ base: '1fr', lg: '2.5fr 1.5fr' }} gap={10}>
                    <GridItem>
                        <VStack spacing={8} align="stretch">
                            <Heading>Book a Test</Heading>
                            <InputGroup>
                                <InputLeftElement pointerEvents="none"><FaSearch color="gray.300" /></InputLeftElement>
                                <Input placeholder="Search for a test..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} borderRadius="full"/>
                            </InputGroup>
                            <VStack spacing={4} align="stretch">
                                <AnimatePresence>
                                    {filteredTests.map((test) => {
                                        const cartItem = cart.find(item => item.id === test.id);
                                        return (
                                            <TestCard
                                                key={test.id}
                                                test={test}
                                                cartItem={cartItem}
                                                onAdd={() => handleAddClick(test)}
                                                onUpdateQuantity={(newQuantity: number) => {
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
            
            {selectedTest && (
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