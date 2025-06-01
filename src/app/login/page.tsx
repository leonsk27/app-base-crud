"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from '@/context/AuthContext';
import type { AuthUser } from '@/lib/types';
import { LogIn, AlertCircle } from 'lucide-react';
import Image from 'next/image';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { getUserByEmailAndName } from '@/app/login/actions';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/');
    }
  }, [user, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const foundUser = await getUserByEmailAndName(email, name);
      if (foundUser) {
        const authUser: AuthUser = { id: foundUser.id, name: foundUser.name, email: foundUser.email };
        login(authUser);
        router.push('/');
      } else {
        setError('Credenciales inválidas. Por favor, intente de nuevo.');
      }
    } catch (err) {
      console.error("Login error:", err);
      setError('Ocurrió un error al iniciar sesión. Intente más tarde.');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary via-accent to-background p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Image src="https://placehold.co/100x100.png?text=MF" alt="Mercado Facil Logo" width={80} height={80} className="mx-auto mb-4 rounded-full" />
          <CardTitle className="text-3xl font-bold text-primary">Mercado Facil</CardTitle>
          <CardDescription>Bienvenido! Ingrese sus credenciales.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Nombre</Label>
              <Input 
                id="name" 
                type="text" 
                placeholder="Ej: Administrador" 
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                required 
                className="bg-input"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email" 
                type="email" 
                placeholder="admin@mercadofacil.com" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                className="bg-input"
              />
            </div>
            {error && (
              <Alert variant="destructive" className="bg-destructive/10">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <AlertDescription className="text-destructive">{error}</AlertDescription>
              </Alert>
            )}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              <LogIn className="mr-2 h-4 w-4" /> Ingresar
            </Button>
          </form>
          <CardDescription className="mt-4 text-xs text-center">
            Usuarios de prueba: <br />
            Administrador / admin@mercadofacil.com <br />
            Juan Perez / juan.perez@mercadofacil.com <br />
            Ana Garcia / ana.garcia@mercadofacil.com
          </CardDescription>
        </CardContent>
      </Card>
    </div>
  );
}
