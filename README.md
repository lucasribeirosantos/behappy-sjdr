# Be Happy Tabacaria — São João del-Rei (landing page)

Site estático (HTML + CSS + JS). Não tem etapa de build: é só subir a pasta inteira para qualquer hospedagem (Netlify, Vercel, Hostinger, Cloudflare Pages).

Para ver localmente:

```bash
npx http-server@14.1.1 -p 5173
```

## Antes de publicar: dados a confirmar

Endereço (Praça Severiano de Resende, 110 · Centro) e WhatsApp ((32) 98892-6577) já estão aplicados. Falta confirmar:

| O quê | Onde | Valor provisório |
|---|---|---|
| Domínio | `index.html` (canonical, og, JSON-LD), `robots.txt`, `sitemap.xml` | `behappysjdr.com.br` |
| Horário | seção "Visite" + `openingHoursSpecification` + `llms.txt` | Seg–Sáb 9h–19h |
| CEP | `address` no JSON-LD | não informado |
| Loja online da franquia | botão "Ir para a loja online" + rodapé | `behappytabacaria.com.br` |
| Bairros atendidos no delivery | lista `.hoods` | Centro, Matosinhos, Fábricas… |
| Iframe do mapa | `.visit__map iframe` | busca pelo nome; troque pelo embed oficial do Perfil da Empresa |

Mantenha os mesmos nome, endereço e telefone (NAP) idênticos no site, no Google Perfil da Empresa e no Instagram. Isso pesa muito no ranking local.

## Por que o Google não deve limitar o alcance

- **Busca orgânica e Google Maps não penalizam tabacarias.** A restrição forte de tabaco é no **Google Ads** e no Merchant Center (anúncios e produtos com preço). Este site não anuncia, não tem carrinho e não mostra preço.
- A página é **informativa**: categorias de produto, sem e-commerce. O rodapé diz isso.
- **Sem bloqueio de idade em tela cheia.** Um bloqueio de idade esconde o conteúdo do Googlebot e piora o Core Web Vitals. No lugar dele, o aviso de 18+ aparece no menu, no FAQ, nas regras do delivery e no rodapé.
- O texto evita termos e imagens associados a drogas ilícitas (nada de folhas, "420", "dichavador" etc.). As fotos foram recortadas para mostrar charutaria, isqueiros, narguilé e o espaço.
- Dados estruturados `Store` + `FAQPage` (JSON-LD), meta geo, `sitemap.xml`, `robots.txt` e `llms.txt` (resumo para buscadores de IA).
- O espaço para fumar é descrito como "espaço reservado para fumantes". O Decreto 8.262/2014 permite isso em tabacarias quando a condição está sinalizada na entrada.

## Melhorias recomendadas

- **Foto do hero em alta resolução**: `foto principal.jpg` tem 1024 px de largura. Uma versão com 2000 px ou mais fica nítida em telas grandes.

## Fotos de produto

As originais ficam em `imagens produtos/` (fora do site). As usadas estão otimizadas em `assets/produtos/` (WebP, até 900 px). Ficaram de fora de propósito, para não associar a página a drogas e evitar redução de alcance: bongs, waterpipe, dichavador, piteiras de vidro, slicks/cuias de silicone, blunt wraps, tesouras e o isqueiro Clipper com estampa de folha.

## Estrutura

`imagens produtos/` (originais, ~180 MB) está no `.gitignore` para não pesar o repositório.

```
index.html        página + SEO + JSON-LD
css/style.css     estilos (tokens no :root)
js/main.js        animações (GSAP + ScrollTrigger + Lenis via CDN)
assets/           fotos otimizadas, logos recoloridos, favicon
robots.txt, sitemap.xml, llms.txt
```

As animações respeitam `prefers-reduced-motion`. Sem JavaScript, o conteúdo inteiro continua visível.
