export default function SettingsPage() {
  return (
    <div>
      <div className="min-h-screen bg-background">
        <div className="container py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Configurações da Conta</h1>
            <p className="text-muted-foreground mb-8">
              Gerencie suas preferências e configurações de conta.
            </p>

            <div className="space-y-8">
              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Preferências</h2>
                <p className="text-muted-foreground">
                  Configurações de preferências do usuário estarão disponíveis
                  em breve.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Notificações</h2>
                <p className="text-muted-foreground">
                  Configurações de notificações estarão disponíveis em breve.
                </p>
              </div>

              <div className="border rounded-lg p-6">
                <h2 className="text-xl font-semibold mb-4">Privacidade</h2>
                <p className="text-muted-foreground">
                  Configurações de privacidade estarão disponíveis em breve.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
