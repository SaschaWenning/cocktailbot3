"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Lock } from "lucide-react"
import AlphaKeyboard from "./alpha-keyboard"

interface PasswordModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export default function PasswordModal({ isOpen, onClose, onSuccess }: PasswordModalProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(false)
  const [showKeyboard, setShowKeyboard] = useState(true)
  const [customPassword, setCustomPassword] = useState("")

  useEffect(() => {
    if (isOpen) {
      setPassword("")
      setError(false)
      setShowKeyboard(true)

      try {
        const savedPassword = localStorage.getItem("customPassword")
        setCustomPassword(savedPassword || "")
      } catch (error) {
        console.error("Fehler beim Laden des benutzerdefinierten Passworts:", error)
      }
    }
  }, [isOpen])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (password === "cocktail" || (customPassword && password === customPassword)) {
      setError(false)
      setPassword("")
      onSuccess()
    } else {
      setError(true)
    }
  }

  const handleKeyPress = (key: string) => {
    setPassword((prev) => prev + key)
    setError(false)
  }

  const handleBackspace = () => {
    setPassword((prev) => prev.slice(0, -1))
    setError(false)
  }

  const handleClear = () => {
    setPassword("")
    setError(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black border-[hsl(var(--cocktail-card-border))] text-[hsl(var(--cocktail-text))] sm:max-w-md max-h-[580px] overflow-y-auto">
        <DialogHeader className="pb-2">
          <DialogTitle className="flex items-center gap-2 text-sm">
            <Lock className="h-4 w-4" />
            Passwort erforderlich
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs">
              Bitte gib das Passwort ein, um Rezepte zu bearbeiten:
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`bg-[hsl(var(--cocktail-bg))] border-[hsl(var(--cocktail-card-border))] h-8 text-sm ${error ? "border-[hsl(var(--cocktail-error))]" : ""}`}
              placeholder="Passwort eingeben"
              autoComplete="off"
              readOnly
              onFocus={() => setShowKeyboard(true)}
            />
            {error && (
              <p className="text-[hsl(var(--cocktail-error))] text-xs">Falsches Passwort. Bitte versuche es erneut.</p>
            )}
          </div>

          {showKeyboard && (
            <div className="mt-2">
              <AlphaKeyboard
                onKeyPress={handleKeyPress}
                onBackspace={handleBackspace}
                onClear={handleClear}
                onConfirm={handleSubmit}
              />
            </div>
          )}

          <DialogFooter className="pt-2">
            <Button
              type="button"
              className="bg-[hsl(var(--cocktail-card-bg))] text-white border-[hsl(var(--cocktail-card-border))] hover:bg-[hsl(var(--cocktail-card-border))] h-8 text-xs px-3"
              onClick={onClose}
            >
              Abbrechen
            </Button>
            <Button
              type="submit"
              className="bg-[hsl(var(--cocktail-primary))] text-black hover:bg-[hsl(var(--cocktail-primary-hover))] h-8 text-xs px-3"
            >
              Bestätigen
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
