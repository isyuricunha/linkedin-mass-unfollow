# Ferramenta de Unfollow em Massa do LinkedIn

<table align="right">
 <tr><td><a href="https://github.com/isyuricunha/linkedin-mass-unfollow/blob/main/readme.md">🇺🇸 English</a></td></tr>
 <tr><td><a href="https://github.com/isyuricunha/linkedin-mass-unfollow/blob/main/README-pt-br.md">🇧🇷 Português</a></td></tr>
</table>

<div align="center">

![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=for-the-badge&logo=linkedin&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Version](https://img.shields.io/badge/Version-2.0.0-blue?style=for-the-badge)

**Uma ferramenta JavaScript poderosa e segura para deixar de seguir conexões do LinkedIn em massa**

[Recursos](#-recursos) • [Instalação](#-instalação) • [Uso](#-uso) • [Segurança](#-segurança) • [FAQ](#-faq)

</div>

---

## 📋 Sobre

Esta ferramenta fornece dois scripts JavaScript sofisticados para ajudá-lo a deixar de seguir conexões do LinkedIn em massa de forma eficiente e segura. Ambos os scripts incluem recursos avançados como rastreamento de progresso, tratamento de erros, atrasos configuráveis e limites de segurança para prevenir unfollows acidentais em massa.

## ✨ Recursos

### 🔧 Recursos Principais
- **Dois Modos de Operação**: Modo suave (apenas conexões visíveis) e Modo difícil (todas as conexões com rolagem automática)
- **Rastreamento Inteligente de Progresso**: Estatísticas em tempo real e resumos de sessão
- **Tratamento Avançado de Erros**: Mecanismos de retry automático e recuperação elegante de erros
- **Configurações Personalizáveis**: Atrasos, limites e comportamento customizáveis
- **Mecanismos de Segurança**: Limites integrados para prevenir unfollows acidentais em massa
- **Controles do Usuário**: Funcionalidades de iniciar, parar, pausar e retomar
- **Log Detalhado**: Logs com timestamp e diferentes níveis de severidade

### 🛡️ Recursos de Segurança
- **Limites Máximos de Unfollow**: Limites de segurança padrão (50 para modo suave, 500 para modo difícil)
- **Limitação de Taxa**: Atrasos configuráveis entre ações para evitar restrições do LinkedIn
- **Controle Manual**: Funcionalidade fácil de pausar/retomar
- **Monitoramento de Progresso**: Atualizações de status e estatísticas em tempo real
- **Recuperação de Erros**: Tratamento automático de operações falhadas

## 🚀 Instalação

### Pré-requisitos
- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Conta ativa do LinkedIn
- Conhecimento básico das ferramentas de desenvolvedor do navegador

### Passos de Configuração

1. **Navegue para a Página de Seguindo do LinkedIn**
   ```
   https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/
   ```

2. **Abra as Ferramentas de Desenvolvedor do Navegador**
   
   | Método | Atalho |
   |--------|--------|
   | Clique direito → Inspecionar | `F12` |
   | Focar Console | `Ctrl + Shift + J` (Windows/Linux)<br>`Cmd + Option + J` (Mac) |
   | Alternar Console | `Ctrl + \`` (crase) |

3. **Carregar o Script**
   - Copie o conteúdo de `Scripts/soft-script.js` ou `Scripts/hard-script.js`
   - Cole no console do navegador
   - Pressione `Enter`

Observação: os scripts validam `window.location.pathname` e não iniciam se você não estiver na página de seguidores. Se você navegar para outra página enquanto o script estiver rodando, ele irá parar automaticamente.

## 📖 Uso

### Modo Suave (Recomendado para Iniciantes)

**Propósito**: Deixa de seguir apenas conexões visíveis na tela atual

```javascript
// Após carregar soft-script.js
LinkedInUnfollow.start()    // Iniciar unfollow das conexões visíveis
LinkedInUnfollow.pause()    // Pausar/retomar o processo
LinkedInUnfollow.stop()     // Parar o processo
LinkedInUnfollow.status()   // Verificar status atual
```

**Recursos**:
- ✅ Processa apenas conexões visíveis
- ✅ Sem rolagem automática
- ✅ Menor risco de limitação de taxa
- ✅ Perfeito para unfollow seletivo

### Modo Difícil (Usuários Avançados)

**Propósito**: Automaticamente deixa de seguir TODAS as conexões com rolagem contínua

```javascript
// Após carregar hard-script.js
LinkedInUnfollowHard.start()    // Iniciar unfollow de TODAS as conexões
LinkedInUnfollowHard.pause()    // Pausar/retomar o processo
LinkedInUnfollowHard.stop()     // Parar o processo
LinkedInUnfollowHard.status()   // Verificar status atual
```

**Recursos**:
- ⚠️ Processa TODAS as conexões automaticamente
- ⚠️ Rolagem contínua para carregar mais conteúdo
- ⚠️ Maior eficiência mas requer mais cuidado
- ⚠️ Limites de segurança e controles integrados

## ⚙️ Configuração

Ambos os scripts oferecem opções extensivas de configuração:

```javascript
// Acessar configuração (exemplo para modo suave)
LinkedInUnfollow.config.delays.betweenUsers = 1500;  // Aumentar atraso entre usuários
LinkedInUnfollow.config.limits.maxUnfollows = 100;   // Alterar máximo de unfollows
LinkedInUnfollow.config.logging = false;             // Desabilitar logging
```

### Configurações Disponíveis

| Configuração | Padrão Modo Suave | Padrão Modo Difícil | Descrição |
|--------------|-------------------|---------------------|-----------|
| `delays.buttonClick` | 1000ms | 1200ms | Atraso após clicar "Seguindo" |
| `delays.betweenUsers` | 800ms | 1000ms | Atraso entre processar usuários |
| `limits.maxUnfollows` | 50 | 500 | Máximo de unfollows por sessão |
| `logging` | true | true | Habilitar/desabilitar logging do console |

## 🛡️ Segurança

### Avisos Importantes

⚠️ **CUIDADO**: Estes scripts irão deixar de seguir conexões do LinkedIn. Use com responsabilidade!

⚠️ **AVISO MODO DIFÍCIL**: O modo difícil tentará deixar de seguir TODAS as suas conexões. Use com extremo cuidado!

### Medidas de Segurança

1. **Limites Integrados**: Scripts têm limites máximos padrão de unfollow
2. **Controle Manual**: Funcionalidade fácil de parar/pausar
3. **Rastreamento de Progresso**: Monitore exatamente o que está acontecendo
4. **Tratamento de Erros**: Tratamento elegante de falhas
5. **Limitação de Taxa**: Atrasos para evitar restrições do LinkedIn

### Melhores Práticas

- ✅ Comece com **Modo Suave** para testar a funcionalidade
- ✅ Mantenha a aba do LinkedIn ativa e visível
- ✅ Monitore a saída do console regularmente
- ✅ Use configurações de atraso razoáveis
- ✅ Não execute múltiplos scripts simultaneamente
- ✅ Permaneça na página de seguidores enquanto executa (o script para automaticamente se a página mudar)
- ❌ Não feche a aba do navegador enquanto executa
- ❌ Não navegue para longe da página do LinkedIn
- ❌ Não execute scripts em outras páginas do LinkedIn

## 📊 Monitorando Progresso

Ambos os scripts fornecem informações detalhadas de progresso:

```javascript
// Obter status atual
const status = LinkedInUnfollow.status();
console.log(status);

// Exemplo de saída:
{
  isRunning: true,
  isPaused: false,
  processed: 25,
  unfollowed: 23,
  errors: 2,
  duration: 180,  // segundos
  rate: 7.7       // unfollows por minuto (apenas modo difícil)
}
```

## 🔧 Solução de Problemas

### Problemas Comuns

**Script não está funcionando?**
- Certifique-se de estar na página correta do LinkedIn
- Verifique se você tem conexões "Seguindo" visíveis
- Verifique se o console do navegador não mostra erros

**Muito rápido/lento?**
- Ajuste as configurações de atraso na configuração
- Use `LinkedInUnfollow.config.delays.betweenUsers = 2000` para operação mais lenta

**Parou inesperadamente?**
- Verifique o console para mensagens de erro
- Verifique se você não atingiu o limite de segurança
- Certifique-se de que a página do LinkedIn ainda está carregada
- Confirme se você ainda está em `https://www.linkedin.com/mynetwork/network-manager/people-follow/followers/`

**LinkedIn mostrando erros?**
- Aumente os atrasos entre ações
- Faça pausas entre sessões
- Considere usar modo suave em vez do modo difícil

## ❓ FAQ

**P: É seguro usar?**
R: Os scripts incluem múltiplas medidas de segurança, mas use por sua própria conta e risco. Comece com modo suave e limites baixos.

**P: O LinkedIn vai banir minha conta?**
R: Os scripts incluem limitação de taxa para reduzir esse risco, mas uso excessivo pode potencialmente acionar as medidas anti-automação do LinkedIn.

**P: Posso desfazer o unfollow?**
R: Não, você precisará seguir novamente as conexões manualmente. Seja cuidadoso com suas seleções.

**P: Quantas conexões posso deixar de seguir?**
R: Os limites padrão são 50 (suave) e 500 (difícil) por sessão. Você pode ajustar estes na configuração.

**P: Posso executar isso no celular?**
R: Não, isso requer um navegador desktop com acesso às ferramentas de desenvolvedor.

**P: Isso funciona com LinkedIn Premium?**
R: Sim, os scripts funcionam com contas gratuitas e premium do LinkedIn.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para enviar issues, solicitações de recursos ou pull requests.

## 📄 Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](license.md) para detalhes.

## ⚠️ Isenção de Responsabilidade

Esta ferramenta é para fins educacionais. Os usuários são responsáveis por cumprir os Termos de Serviço do LinkedIn. Os autores não são responsáveis por quaisquer consequências do uso desta ferramenta.

## 🙏 Agradecimentos

As primeiras versões deste projeto foram influenciadas por scripts públicos de unfollow em massa no LinkedIn e exemplos da comunidade, incluindo o trabalho publicado por [verfasor](https://github.com/verfasor) no [mgx.me](https://mgx.me/script-to-mass-unfollow-everyone-on-linkedin) e no repositório [mass-unfollow-linkedin](https://github.com/verfasor/mass-unfollow-linkedin). Desde então, o projeto foi substancialmente refatorado e evoluiu de forma independente.

---

<div align="center">

**Feito com ❤️ por [isyuricunha](https://github.com/isyuricunha)**

⭐ Dê uma estrela neste repositório se ele te ajudou!

</div>
